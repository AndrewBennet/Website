jQuery(function($){

  var sticks = $('#sticks'),
      humansGo = true;
      hasStartedGame = false;

  /*
    Tiny helper functions
  */
  Array.prototype.last = function() {
      return this[this.length-1];
  }
  Array.prototype.random = function() {
      return this[Math.floor(Math.random()*this.length)];
  }
  

  /*
    Build the stick tree, to be called on page load.
  */
  function setup(){
    for(rowIndex = 0; rowIndex <= 3; rowIndex++){
      var row = $('<div class="row"></div>');
      for(stickIndex = 1; stickIndex <= 2*rowIndex + 1; stickIndex++){
        var stick = $('<span class="stick"></span>');
        stick.data('row', rowIndex);
        stick.data('index', stickIndex);
        row.append(stick);
      }
      sticks.append(row);
    }
    updateCurrentXorValue();
  };

  // Setup before attaching events.
  setup();

  /*
    Returns whether the current state is a valid move.
  */
  function moveIsValid(){
    // Get all the clicked sticks. If there are none, is not a valid move.
    var clicked = $('.clicked');
    if(clicked.length === 0){
      return false;
    }

    // Sort the array
    clicked.sort(function(a,b){
      // Sort by row, then index
      return (100*$(a).data('row') - 100*$(b).data('row')) + ($(a).data('index') - $(b).data('index'));
    });

    var isValid = true;
    var previousRowIndex = null;
    var previousIndex = null;
    $.each(clicked, function(i, item) {
      var rowIndex = $(item).data('row'),
          index = $(item).data('index');

      // First run is special; don't do the comparison.
      // For subsequent runs, check that the row is the same and the index is +1.
      if(i !== 0 && (rowIndex !== previousRowIndex || index !== previousIndex + 1)){
        isValid = false;
        return false;
      }

      // Set the values for the next iteration
      previousIndex = index;
      previousRowIndex = rowIndex;
    });

    return isValid;
  }

  function gameOver(computerWon){
    if(computerWon){
      $('#go-indicator').html('You lost <i class="fa fa-frown-o"></i>');
    }
    else{
      $('#go-indicator').html('You won! <i class="fa fa-smile-o"></i>');
    }
  }

  /*
    Compute the best move and do it.
  */
  function performComputersMove(){
    // Check whether the game is over.
    var availableSticks = $('.stick:not(.fixed)');
    if(availableSticks.length === 0){
      gameOver(true);
      return;
    }

    // This arguably should be done in the calling method.
    var computerHasLost = false;
    if(availableSticks.length === 1){
      computerHasLost = true;
    }

    /* ==== Strategy ====
    
    1. Find the largest size of an isolated stick group, n.
    2. For i in 1 to n, do:
      3. For each stick group, do:
        4. For each way of removing i consecutive sticks, do:
          5. Calculate the XOR of the configuration.
          6. If the XOR = 0, add the removed sticks, within an array, to an array of possible moves.
    7. Pick one of the elements of the possible-moves array and remove all the sticks within *that* array.
    
    */

    var badMoves = [];
    var goodMoves = [];
    var currentStateStickGroups = getIsolatedStickGroups($('.stick').not('.fixed'));
    var desiredXor = finalDecisionCanBeMade(currentStateStickGroups) ? 1 : 0;
    
    // 1. Calculate the largest stick group size
    var largestStickGroupSize = $.map(currentStateStickGroups, function(val, i){ return val.length; })
      .sort(function(a, b) { return a - b })
      .last();

    // 2. Loop over all sizes
    for(var numberOfSticksToRemove = 1; numberOfSticksToRemove <= largestStickGroupSize; numberOfSticksToRemove++){
      
      // 3. Loop over all stick groups
      $.each(currentStateStickGroups, function(stickGroupIndex, stickGroup){
        
        // 4. Calculate all ways of removing i consecutive sticks from the stickGroup
        
        // We can't remove more sticks than we have
        if(numberOfSticksToRemove > stickGroup.length){
          return true;
        }

        // The number of ways we can do it is the difference between the number of 
        // sticks we want to remove and the number of sticks we have. Use the starting
        // point of where to remove sticks as the variable for looping.
        for(var removalStartIndex = 0; removalStartIndex <= (stickGroup.length - numberOfSticksToRemove); removalStartIndex++){
          
          // Clone the whole situation.
          var clonedStickGroupState = currentStateStickGroups.slice(0);
          
          // Remove the current stick group, and put back up to 2
          // new stick groups.
          clonedStickGroupState.splice(stickGroupIndex, 1);
          if(removalStartIndex !== 0){
            clonedStickGroupState.push(stickGroup.slice(0, removalStartIndex));
          }
          if(numberOfSticksToRemove !== stickGroup.length){
            clonedStickGroupState.push(stickGroup.slice(removalStartIndex + numberOfSticksToRemove));
          }

          // Work out whick sticks are removed in this state
          var removedSticks = stickGroup.slice(removalStartIndex, removalStartIndex + numberOfSticksToRemove);

          // 5. Calculate the XOR
          var thisMoveXor = computeXor(clonedStickGroupState);
          if(thisMoveXor === desiredXor){
            goodMoves.push(removedSticks);
          }
          else{
            badMoves.push(removedSticks);
          }
        }
      });
    }

    // 7. Pick one of the moves
    var moveToMake = null;
    if(goodMoves.length > 0){
      moveToMake = goodMoves.random();
    }
    else{
      moveToMake = badMoves.random();
    }

    // Make the move!
    $.each(moveToMake, function(index, stick){
      $(stick).addClass('fixed');
    });

    updateCurrentXorValue();
    $('#whos-move').html('The computer\'s');

    humansGo = false;
    // Disable the button until the next human's go.
    setTimeout(function(){
      if(computerHasLost){
        gameOver(false);
      }
      else{
        $('#done-button').toggleClass('disabled', true);
        $('#whos-move').html('Your');
        humansGo = true;
      }
    }, 1000);
  }

  function updateCurrentXorValue(){
    var stickSizes = getIsolatedStickGroups($('.stick').not('.clicked').not('.fixed'));
    $('#xor-result').html(computeXor(stickSizes));
  }

  /*
    Gets an array like: [[stick], [stick, stick], [stick]].
    I.e. separates each isolated group of sticks.
  */
  function getIsolatedStickGroups(availableSticks){
    // Sort the array
    availableSticks.sort(function(a,b){
      // Sort by row, then index
      return (100*$(a).data('row') - 100*$(b).data('row')) + ($(a).data('index') - $(b).data('index'));
    });

    var isolatedStickGroups = [];
    var previousRowIndex = null;
    var previousIndex = null;
    $.each(availableSticks, function(i, item) {
      var rowIndex = $(item).data('row'),
          index = $(item).data('index');

      // For the first run, or any subsequent run where the stick is the start of a new group,
      // add a new array to the isolated stick groups array.
      if(i === 0 || !(rowIndex === previousRowIndex && index === previousIndex + 1)){
        isolatedStickGroups.push([item]);
      }
      else if(rowIndex === previousRowIndex && index === previousIndex + 1){
        // Otherwise, add the stick to the last array in the isolated stick groups array.
        isolatedStickGroups.last().push(item);
      }

      // Set the values for the next iteration
      previousIndex = index;
      previousRowIndex = rowIndex;
    });
    
    return isolatedStickGroups;
  }

  function finalDecisionCanBeMade(isolatedStickGroups){
    var numberOfStickGroupsWithMoreThanOne = 0;
    $.each(isolatedStickGroups, function(i, item){
      if(item.length > 1){
        numberOfStickGroupsWithMoreThanOne += 1;
      }
    });
    return numberOfStickGroupsWithMoreThanOne === 1;
  }

  function computeXor(isolatedStickGroups){
    var xorResult = 0;
    $.each(isolatedStickGroups, function(i, item){
      xorResult ^= item.length;
    });
    return xorResult;
  }

  function beginComputersGo(){
    $('#whos-move').html('The computer\'s');
    humansGo = false;

    // Disable the button until the next human's go.
    $('#done-button').toggleClass('disabled', true);

    setTimeout(performComputersMove, 1000);
  }

  /*=====================================================
  =================== Event Handlers ====================
  ======================================================*/

  /*
    Show or hide the instructions.
  */
  $('#how-to-play-toggle').click(function(){
    var howToPlay = $('#how-to-play');
    var instructionsShouldBeShown = howToPlay.hasClass('hidden');

    howToPlay.toggleClass('hidden', !instructionsShouldBeShown);
    $(this).toggleClass('fa-chevron-circle-down', !instructionsShouldBeShown);
    $(this).toggleClass('fa-chevron-circle-up', instructionsShouldBeShown);
  });

  /*
    Selecting who should go first.
  */
  $('.first-go-person').click(function(){
    hasStartedGame = true;
    $('#who-first').addClass('hidden');
    $('#make-move-section').removeClass('hidden');

    if(this.id === 'comp-first'){
      beginComputersGo();
    }
  });

  /*
    On clicking an available stick, cross it out and colour it red.
  */
  $('.stick').click(function(){

    // If it's not the human's go, or the stick can't be clicked, don't process the move.
    if(!humansGo || !hasStartedGame || $(this).hasClass('fixed')){
      return false;
    }

    // Mark this stick as clicked.
    $(this).toggleClass('clicked');

    // The done button can be pressed iff the move is valid.
    var isValid = moveIsValid();
    $('#done-button').toggleClass('disabled', !isValid);
    $('#not-valid').toggleClass('hidden', isValid);

    updateCurrentXorValue();
  });

  /*
    On pressing the done button, fix the clicked sticks.
  */
  $('#done-button').click(function(){
    // If it's not the human's go, or the button is disabled, don't process the move.
    if(!humansGo || !hasStartedGame || $(this).hasClass('disabled')){
      return false;
    }

    var clicked = $('.clicked');
    clicked.removeClass('clicked');
    clicked.addClass('fixed');

    beginComputersGo();
  });

  /*
    Toggle the display of the XOR value.
  */
  $('#hints-mode').click(function(){
    var xorDiv = $('#xor');
    xorDiv.toggleClass('hidden');
    var turnOn = xorDiv.hasClass('hidden');
    $(this).html('Turn ' + (turnOn ? 'on' : 'off') + ' hints mode.');
  });
});
