$( document ).ready( function (){
  registerDraggableElements();
  registerRankingElementChange();
  registerUnrankedElementChange();
  registerSubmitRanking();
});

function registerDraggableElements() {
  $( "ul.droptrue" ).sortable({
    connectWith: "ul"
  });
}

function registerRankingElementChange() {
  $( "#ranked-options" ).sortable({
    update: onRankedElementsChanged
  });
}

function onRankedElementsChanged( event, ui ) {
  var $children = $( this ).children();
  $children.each( function( index ) {
    $( this ).children( "span" ).text( "Rank: " + String(index+1) );
  });
}

function registerUnrankedElementChange() {
  $( "#unranked-options" ).sortable({
    update: onUnrankedElementsChanged
  });
}

function onUnrankedElementsChanged( event, ui ) {
  var $children = $( this ).children();

  if( $children.length === 0 ) {
    $( "#submit-ranking" ).show();
  }
  else {
    $children.each( function( index ) {
      $( this ).children( "span" ).text( "" );
    });
    $( "#submit-ranking" ).hide();
  }
}

function registerSubmitRanking() {
  $( "#submit-ranking" ).click( onSubmitRanking );
}

function onSubmitRanking() {
  var $rankedOptions = $( "#ranked-options" );
  var $children = $rankedOptions.children();
  var totalCount = 0;
  var rankedChoices = [];
  $children.each( function( index ) {
    totalCount++;
    var curRank = index + 1;//Number( $( this ).children( "span" ).text().slice(5) );
    var curID = Number( $( this ).attr( "id" ));
    rankedChoices.push( { id: curID, rank: curRank } );
    console.log( $( this ).text(), "Rank: ", curRank, "ID:", curID );
  });
  var bordaCount = totalCount;
  for( var i = 0; i < rankedChoices.length; i++ ) {
    rankedChoices[i]["borda"] = bordaCount;
    bordaCount--;
  }

  $.ajax({
    method: "POST",
    url: $(location).attr('href'),
    data: { rankedChoices }
  })
  .done( function( msg ) {
  })
  .fail( function(err) {
  });
}

