$(document).ready(function () {
    var playerName;
    var cardPairs;
    var cards = [];
    var flippedCards = [];
    var matchedPairs = 0;
    var totalPairs = 0;
    var gameStarted = false;
    var timerInterval=null;
    var lastMatchedCard1;
    var lastMatchedCard2;
    var score = 0;
    var timerPaused = false;
    var startTime = null; 
    var elapsedTime = 0;
    var timePlayed;
    var moveCount = 0;

    
    
     /**
   * Initializes the game by setting player name, card pairs, and starting the game.
   * Validates user inputs and displays appropriate alerts for invalid inputs.
   */
  
     // Initialize the game when the document is ready
    function initGame() {
      playerName = $("#playerNameInput").val().trim();
      cardPairs = parseInt($("#cardPairsInput").val(), 10);
      $(".game-container").addClass("game-started");
  
      if(playerName === "" ){
        alert("Invalid input. Please enter your name");
        $("#pauseBtn").hide();
        $("#resumeBtn").hide();
        $(".loader").hide();
        $("#Timer").hide();
        $("#Score").hide();
        return;
  
      }
  
      if (isNaN(cardPairs) || cardPairs <= 0 || cardPairs > 30) {
        alert("Invalid input. Please enter a valid number of card pairs.");
        $("#pauseBtn").hide();
        $("#resumeBtn").hide();
        $("#Timer").hide();
        $("#Score").hide();
        return;
      }
  
      totalPairs = cardPairs;
  
      for (var i = 1; i <= cardPairs; i++) {
        cards.push({ value: i, flipped: false, matched: false });
        cards.push({ value: i, flipped: false, matched: false });
      }

      
  
      renderCards();
      setTimeout(function() {
        shuffleArray(cards); // Shuffle the cards after a short delay
      }, 1000);
      
  
      
      startTimer();
  
      $(".header").html('<div class="game-name">' +  'Name: ' + playerName + '</div>');
      $(".input-container").hide();
      $(".quit-button").show();
      $(".welcome-message").hide();
      $("#pauseBtn").show();
      $("#Timer").show();
      $("#Score").show();

  
      gameStarted = true;
      
  
    }
  
    function renderCards() {
        var Cards = [
            { value: "card1", imageUrl: "https://i.pinimg.com/originals/f7/30/a5/f730a54ada0c23742a4983f8383817b8.png" },
            { value: "card1", imageUrl: "https://i.pinimg.com/originals/f7/30/a5/f730a54ada0c23742a4983f8383817b8.png" },
            { value: "card2", imageUrl: "https://www.pngitem.com/pimgs/m/213-2139273_transparent-po-png-kung-fu-panda-png-png.png" },
            { value: "card2", imageUrl: "https://www.pngitem.com/pimgs/m/213-2139273_transparent-po-png-kung-fu-panda-png-png.png" },
            { value: "card3", imageUrl: "https://static.wikia.nocookie.net/kungfupanda/images/e/ef/KFP3-promo-mantis1.jpg/revision/latest?cb=20150726231824" },
            { value: "card3", imageUrl: "https://static.wikia.nocookie.net/kungfupanda/images/e/ef/KFP3-promo-mantis1.jpg/revision/latest?cb=20150726231824" },
            { value: "card4", imageUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/db9ed8c9-b18e-40d7-9b96-eb34d64138e6/dfrmkxh-f79502a9-1deb-4af4-ac58-81af2d6e662e.png/v1/fill/w_1088,h_734/monkey__kung_fu_panda__png_by_jakeysamra_dfrmkxh-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzM1IiwicGF0aCI6IlwvZlwvZGI5ZWQ4YzktYjE4ZS00MGQ3LTliOTYtZWIzNGQ2NDEzOGU2XC9kZnJta3hoLWY3OTUwMmE5LTFkZWItNGFmNC1hYzU4LTgxYWYyZDZlNjYyZS5wbmciLCJ3aWR0aCI6Ijw9MTA4OSJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.6MxavSMx120aWhdgy2bXSjT9bc_adx4NkUtYwk_1ZnY" },
            { value: "card4", imageUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/db9ed8c9-b18e-40d7-9b96-eb34d64138e6/dfrmkxh-f79502a9-1deb-4af4-ac58-81af2d6e662e.png/v1/fill/w_1088,h_734/monkey__kung_fu_panda__png_by_jakeysamra_dfrmkxh-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzM1IiwicGF0aCI6IlwvZlwvZGI5ZWQ4YzktYjE4ZS00MGQ3LTliOTYtZWIzNGQ2NDEzOGU2XC9kZnJta3hoLWY3OTUwMmE5LTFkZWItNGFmNC1hYzU4LTgxYWYyZDZlNjYyZS5wbmciLCJ3aWR0aCI6Ijw9MTA4OSJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.6MxavSMx120aWhdgy2bXSjT9bc_adx4NkUtYwk_1ZnY" },
            { value: "card5", imageUrl: "https://www.pngplay.com/wp-content/uploads/14/Kung-Fu-Panda-Tiger-PNG-HD-Quality.png" },
            { value: "card5", imageUrl: "https://www.pngplay.com/wp-content/uploads/14/Kung-Fu-Panda-Tiger-PNG-HD-Quality.png" },
            { value: "card6", imageUrl: "https://i.redd.it/8m8lagfcnte41.jpg" },
            { value: "card6", imageUrl: "https://i.redd.it/8m8lagfcnte41.jpg" },
            { value: "card7", imageUrl: "https://www.pngkit.com/png/detail/68-686404_clipart-doraemon-png-gloria-madagascar.png" },
            { value: "card7", imageUrl: "https://www.pngkit.com/png/detail/68-686404_clipart-doraemon-png-gloria-madagascar.png" },
            { value: "card8", imageUrl: "https://www.pngitem.com/pimgs/m/111-1115234_giraffe-png-madagascar-melman-the-giraffe-transparent-png.png" },
            { value: "card8", imageUrl: "https://www.pngitem.com/pimgs/m/111-1115234_giraffe-png-madagascar-melman-the-giraffe-transparent-png.png" },
            { value: "card9", imageUrl: "https://www.pngmart.com/files/6/Simba-Transparent-PNG.png" },
            { value: "card9", imageUrl: "https://www.pngmart.com/files/6/Simba-Transparent-PNG.png" },
            { value: "card10", imageUrl: "https://www.pngmart.com/files/22/Scooby-Doo-Where-Are-You-PNG-HD.png" },
            { value: "card10", imageUrl: "https://www.pngmart.com/files/22/Scooby-Doo-Where-Are-You-PNG-HD.png" },
            { value: "card11", imageUrl: "https://www.pngmart.com/files/16/Aquatic-Nemo-Shark-PNG-Clipart.png" },
            { value: "card11", imageUrl: "https://www.pngmart.com/files/16/Aquatic-Nemo-Shark-PNG-Clipart.png" },
            { value: "card12", imageUrl: "https://www.pngmart.com/files/5/Nemo-Transparent-Background.png" },
            { value: "card12", imageUrl: "https://www.pngmart.com/files/5/Nemo-Transparent-Background.png" },
            { value: "card13", imageUrl: "https://www.pngmart.com/files/16/Nemo-Shark-PNG-Image.png" },
            { value: "card13", imageUrl: "https://www.pngmart.com/files/16/Nemo-Shark-PNG-Image.png" },
            { value: "card14", imageUrl: "https://pngimg.com/uploads/lion_king/lion_king_PNG68.png" },
            { value: "card14", imageUrl: "https://pngimg.com/uploads/lion_king/lion_king_PNG68.png" },
            { value: "card15", imageUrl: "https://static.wikia.nocookie.net/p__/images/0/03/Pumbaa_Diamond_Edition_art.png/revision/latest?cb=20210110001215&path-prefix=protagonist" },
            { value: "card15", imageUrl: "https://static.wikia.nocookie.net/p__/images/0/03/Pumbaa_Diamond_Edition_art.png/revision/latest?cb=20210110001215&path-prefix=protagonist" },
            { value: "card16", imageUrl: "https://www.pngmart.com/files/7/Jerry-Transparent-PNG.png" },
            { value: "card16", imageUrl: "https://www.pngmart.com/files/7/Jerry-Transparent-PNG.png" },
            { value: "card17", imageUrl: "https://www.pngmart.com/files/4/Mickey-Mouse-PNG-Picture.png" },
            { value: "card17", imageUrl: "https://www.pngmart.com/files/4/Mickey-Mouse-PNG-Picture.png" },
            { value: "card18", imageUrl: "https://static.wikia.nocookie.net/dreamworks/images/2/25/SkipperNew.png/revision/latest?cb=20211201221953" },
            { value: "card18", imageUrl: "https://static.wikia.nocookie.net/dreamworks/images/2/25/SkipperNew.png/revision/latest?cb=20211201221953" },
            { value: "card19", imageUrl: "https://www.pngmart.com/files/4/Winnie-The-Pooh-PNG-Image.png" },
            { value: "card19", imageUrl: "https://www.pngmart.com/files/4/Winnie-The-Pooh-PNG-Image.png" },
            { value: "card20", imageUrl: "https://www.pngmart.com/files/4/Winnie-The-Pooh-PNG-Pic.png" },
            { value: "card20", imageUrl: "https://www.pngmart.com/files/4/Winnie-The-Pooh-PNG-Pic.png" },
            { value: "card21", imageUrl: "https://www.pngmart.com/files/7/Jerry-PNG-Photo.png" },
            { value: "card21", imageUrl: "https://www.pngmart.com/files/7/Jerry-PNG-Photo.png" },
            { value: "card22", imageUrl: "https://www.pngmart.com/files/13/Bugs-Bunny-PNG-Background-Image.png" },
            { value: "card22", imageUrl: "https://www.pngmart.com/files/13/Bugs-Bunny-PNG-Background-Image.png" },
            { value: "card23", imageUrl: "https://www.pngmart.com/files/22/Spongebob-Background-PNG-Isolated-File.png" },
            { value: "card23", imageUrl: "https://www.pngmart.com/files/22/Spongebob-Background-PNG-Isolated-File.png" },
            { value: "card24", imageUrl: "https://www.pngplay.com/wp-content/uploads/2/Patrick-Star-Background-PNG-Image.png" },
            { value: "card24", imageUrl: "https://www.pngplay.com/wp-content/uploads/2/Patrick-Star-Background-PNG-Image.png" },
            { value: "card25", imageUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1ea08e12-847b-4c43-8433-ff86b833fd7b/dfkesca-7c66bf8d-3bd9-409c-9dd6-de693453527f.png/v1/fill/w_801,h_998/nick_wilde__zootopia__by_blue_leader97_dfkesca-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTUzNiIsInBhdGgiOiJcL2ZcLzFlYTA4ZTEyLTg0N2ItNGM0My04NDMzLWZmODZiODMzZmQ3YlwvZGZrZXNjYS03YzY2YmY4ZC0zYmQ5LTQwOWMtOWRkNi1kZTY5MzQ1MzUyN2YucG5nIiwid2lkdGgiOiI8PTEyMzMifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.lhJ0m5U0_4sNUmXvlI0rEOfPmlT-w1Vy4AausVr5oY8" },
            { value: "card25", imageUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1ea08e12-847b-4c43-8433-ff86b833fd7b/dfkesca-7c66bf8d-3bd9-409c-9dd6-de693453527f.png/v1/fill/w_801,h_998/nick_wilde__zootopia__by_blue_leader97_dfkesca-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTUzNiIsInBhdGgiOiJcL2ZcLzFlYTA4ZTEyLTg0N2ItNGM0My04NDMzLWZmODZiODMzZmQ3YlwvZGZrZXNjYS03YzY2YmY4ZC0zYmQ5LTQwOWMtOWRkNi1kZTY5MzQ1MzUyN2YucG5nIiwid2lkdGgiOiI8PTEyMzMifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.lhJ0m5U0_4sNUmXvlI0rEOfPmlT-w1Vy4AausVr5oY8" },
            { value: "card26", imageUrl: "https://i.pinimg.com/originals/94/b6/f0/94b6f0d2e896058720575aede93abf97.png" },
            { value: "card26", imageUrl: "https://i.pinimg.com/originals/94/b6/f0/94b6f0d2e896058720575aede93abf97.png" },
            { value: "card27", imageUrl: "https://www.pngmart.com/files/4/Donald-Duck-PNG-File.png" },
            { value: "card27", imageUrl: "https://www.pngmart.com/files/4/Donald-Duck-PNG-File.png" },
            { value: "card28", imageUrl: "https://purepng.com/public/uploads/large/purepng.com-ice-age-sidice-ageiceage2002omputer-animated-buddycomedy20th-century-fox-1701528608598c75en.png" },
            { value: "card28", imageUrl: "https://purepng.com/public/uploads/large/purepng.com-ice-age-sidice-ageiceage2002omputer-animated-buddycomedy20th-century-fox-1701528608598c75en.png" },
            { value: "card29", imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Squidward_Tentacles.svg/1200px-Squidward_Tentacles.svg.png" },
            { value: "card29", imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Squidward_Tentacles.svg/1200px-Squidward_Tentacles.svg.png" },
            { value: "card30", imageUrl: "http://clipart-library.com/img/1995867.png" },
            { value: "card30", imageUrl: "http://clipart-library.com/img/1995867.png" },
                    
            
          ]; 
          
          var shuffledArray = shuffleArrayWithPairs(Cards);

          function shuffleArrayWithPairs(array) {
            // Divide the array into pairs
            var pairs = [];
            for (var i = 0; i < array.length; i += 2) {
              pairs.push(array.slice(i, i + 2));
            }
          
            // Shuffle the pairs
            for (var j = pairs.length - 1; j > 0; j--) {
              var k = Math.floor(Math.random() * (j + 1));
              [pairs[j], pairs[k]] = [pairs[k], pairs[j]];
            }
          
            // Flatten the shuffled pairs back into a single array
            var shuffledArray = pairs.flat();
            return shuffledArray;
          }
          
          
          var useCards =[];
          
          for (var i = 0; i < cardPairs*2; i = i + 2) {
            useCards.push(shuffledArray[i]);
            useCards.push(shuffledArray[i + 1]);
          }
          shuffleArray(useCards);
      var gameBoard = $(".game-board");
      gameBoard.empty();
  
      var numColumns = Math.ceil(Math.sqrt(cardPairs * 2));
      var numRows = Math.ceil((cardPairs * 2) / numColumns);
  
      for (var i = 0; i < useCards.length; i++) {
        var card = $('<div class="card"><div class="card-inner"><div class="card-front"></div><div class="card-back"></div></div></div>');
        card.attr("data-index", i);
        card.attr("data-value", useCards[i].value);
      
        var image = $('<img src="' + useCards[i].imageUrl + '" alt="Card Image">');
        image.css({
            display: "block",
            margin: "auto",
            maxWidth: "180px",
            maxHeight: "240px",
            objectFit: "fill",
            borderRadius: "20px" // Added border-radius to match the card style
          });     
        card.find(".card-back").append(image);
      
        gameBoard.append(card);
      }
  
      gameBoard.css("grid-template-columns", "repeat(" + numColumns + ", 1fr)");
      gameBoard.css("grid-template-rows", "repeat(" + numRows + ", 1fr)");
  
      $(".card").click(function () {
        if (
          gameStarted &&
          !$(this).hasClass("flipped") &&
          !$(this).hasClass("matched") &&
          flippedCards.length < 2
        ) {
          $(this).addClass("flipped");
  
          flippedCards.push($(this));
  
          if (flippedCards.length === 2) {
            moveCount++; // Increment moveCount on each card click
            checkMatch();
          }
        }
      });
    }
  
    $("#newGameBtn").click(function() {
    $("#newGameModal").hide();
    
    restartGame();
    $(".input-container").show();
    $(".welcome-message").show();
  });
  
  
  $("#noBtn").click(function() {
    $("#goodbyeModal").show();
    setTimeout(function() {
        window.close();
      }, 2000);
  });
  
  $(".close, .modal").click(function() {
    $("#goodbyeModal").hide();
  });
  
  $(".modal-content").click(function(event) {
    event.stopPropagation();
  });
  
  $("#info-button").click(function() {
    $("#info-modal").show();
  });

  $("#got-it-button").click(function() {
    $("#info-modal").hide();
  });
  
  
  
  $(".quit-button").click(function() {
    $("#quitModal").show();
    
  });
  
  $("#confirmQuitBtn").click(function() {
    $("#quitModal").hide();
    clearInterval(timerInterval);
    restartGame();
  
   
  });
  
  $("#cancelQuitBtn").click(function() {
    $("#quitModal").hide();
  });
  

    function checkMatch() {
      var card1 = flippedCards[0];
      var card2 = flippedCards[1];
  
      if (card1.attr("data-value") === card2.attr("data-value")) {
        card1.css("pointer-events", "none");
        card2.css("pointer-events", "none");
        card1.addClass("matched");
        card2.addClass("matched");

        flippedCards = [];

  
        lastMatchedCard1 = card1; // Store the last matching cards
        lastMatchedCard2 = card2;
  
        matchedPairs++;
        score += calculateScore();
        $(".moves").text("Number of moves: " + moveCount);
 
        $(".matched-pairs").text("Matched Pairs: " + matchedPairs+ '/'+ totalPairs);
        $(".score").text("Your Score is: " + score+ " (calaculated by the time and number of moves of reaveling all the pairs)");
  
        if (matchedPairs === totalPairs) {
      stopTimer();
       timePlayed = $(".timer").text().replace(/Timer:\s*/, '');
      setTimeout(function () {
        flipLastMatchingCards();
        setTimeout(function () {
          // Show the new game modal
          $("#newGameModal").show();
  
          // Set the congratulatory message with player's name and time played
          $("#congratulationsMessage").text(
            "Game Over! Congratulations, " + playerName + "! You completed the game in a time of " + timePlayed + " and in " + moveCount+ " moves. Your Score is: " + score + " points"
          );
        }, 500);
      }, 500);
    }
      } else {
        setTimeout(function () {
          $(".moves").text("Number of moves: " + moveCount);
          card1.removeClass("flipped");
          card2.removeClass("flipped");
          flippedCards = [];
        }, 1000);
      }
    }
  
  
    function calculateScore() {
      var elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      var maxScore = 1000; // Highest score 
      var maxTime = 15; // Maximum time allowed in seconds
      var maxPairs = 30; // Total number of card pairs
      var maxMoves = 10; // Maximum number of moves allowed
    
      var timeScore = Math.max(maxScore - (elapsedTime * (maxScore / maxTime)), 0); // Calculate time-based score
      var pairScore = Math.floor((matchedPairs / maxPairs) * maxScore); // Calculate pair-based score
      var moveScore = Math.max(maxScore - (moveCount * (maxScore / maxMoves)), 0); // Calculate move-based score
    
      return Math.floor((timeScore + pairScore + moveScore) / 3); // Combine and return the average score
    }
    
    
  
  
  
    function flipLastMatchingCards() {
      lastMatchedCard1.find(".card-inner").css("transform", "rotateY(180deg)");
      lastMatchedCard2.find(".card-inner").css("transform", "rotateY(180deg)");
    }
  
    function restartGame() {
      cards = [];
      flippedCards = [];
      matchedPairs = 0;
      totalPairs = 0;
      gameStarted = false;
      startTime = null; 
      timerPaused = false;
     elapsedTime = 0;
     moveCount=0;
      
  
      score = 0;
          $(".score").text("Your Score is: " + score);
  
      $(".game-container").removeClass("game-started");
  
      $(".game-board").empty();
      $(".timer").text("Timer: 00:00");
      $(".matched-pairs").text("");
      $(".moves").text("");
  
      $(".header").html('<div class="game-name">Memory Game</div>');
      $(".welcome").html('<div class="welcome"><div class="welcome-message" id="welcomeMessage">Welcome! Please enter your username and the number of pairs of cards you want to play with</div></div>');
  
      
      $("#resumeBtn").hide();
      $(".loader").hide();
      $(".input-container").show();
      $(".quit-button").hide();
  
      $("#playerNameInput").val("");
      $("#cardPairsInput").val("");
  
      // Reset the cards to their initial state, including the last matched pair
      $(".card").removeClass("matched flipped").css("pointer-events", "auto");
      if (lastMatchedCard1 && lastMatchedCard2) {
        lastMatchedCard1.find(".card-inner").css("transform", "rotateY(0deg)");
        lastMatchedCard2.find(".card-inner").css("transform", "rotateY(0deg)");
        lastMatchedCard1 = null;
        lastMatchedCard2 = null;
  
     
      }
    }
  
    
    function startTimer() {
    if (startTime === null) {
      startTime = Date.now() - elapsedTime; // Subtract elapsed time during pause
    }
  
    timerInterval = setInterval(function() {
      if (!timerPaused) {
        var currentTime = Date.now();
        elapsedTime = currentTime - startTime; // Update elapsed time
        var seconds = Math.floor(elapsedTime / 1000);
        var minutes = Math.floor(seconds / 60);
        seconds %= 60;
        $(".timer").text('Timer: ' + formatTime(minutes) + ":" + formatTime(seconds));
      }
    }, 1000);
  }
  
    function stopTimer() {
      clearInterval(timerInterval);
    }
  
    function formatTime(time) {
      return time.toString().padStart(2, "0");
    }
  
    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  
  
    $("#startGameBtn").click(function () {
    initGame();
  });
  
  $(".new-game-btn").click(function() {
    restartGame();
    $(".game-over").hide();
  });
  
  
  $("#pauseBtn").click(function() {
    clearInterval(timerInterval);
    timerPaused = true;
    $(".card").css("pointer-events", "none");
    $("#pauseBtn").hide();
    $("#resumeBtn").show();
  });
  
  $("#resumeBtn").click(function() {
    startTime = Date.now() - elapsedTime; // Subtract elapsed time during pause
    timerPaused = false;
    $(".card").css("pointer-events", "auto");
    $("#resumeBtn").hide();
    $("#pauseBtn").show();
    startTimer(); // Restart the timer
  });  
  function formatTime(time) {
          return time.toString().padStart(2, "0");
        }  
  });
  
  
  $(document).ready(function() {
    $("#pauseBtn").click(function() {
      $(".loader").toggle();
    });
  });
  
  $("#resumeBtn").click(function() {
      $(".loader").hide();
    });
  