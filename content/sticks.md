---
title: "Sticks"
date: 2017-08-13T15:41:31+01:00
draft: false
---
<script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script type="text/javascript" src="../js/sticks.js"></script>
<link rel="stylesheet" type="text/css" href="../css/sticks.css">

<div id="content">
    How to play? <i id="how-to-play-toggle" class="fa fa-chevron-circle-down"></i>
    <div id="how-to-play" class="hidden">
      Sticks is a two player game. The players take turns to cross off sticks.
      The sticks crossed off in a turn must all be in the same row, and be in a connected line.
      The player who crosses off the last stick loses the game.
      <span id="hints-mode">Turn on hints mode.</span>
    </div>
    <div id="sticks"></div>
    <div class="hidden" id="xor">
      Bitwise XOR: <span id="xor-result"/>
    </div>
    <div id="who-first">
      <h2>Who should go first?</h2>
      <div>
        <span id="you-first" class="button-like first-go-person">You</span>
        <span id="comp-first" class="button-like first-go-person">Computer</span>
      </div>
    </div>
    <div id="make-move-section" class="hidden">
      <h2 id="go-indicator">
        <span id="whos-move">Your</span> go.
        <span id="not-valid" class="hidden">Not valid <i class="fa fa-frown-o"></i></span>
      </h2>
      <p />
      <span id="done-button" class="button-like disabled">Submit Move</span>
    </div>
  </div>
</div>

