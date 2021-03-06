//CLIENT-SIDE JS

//Success & Error handle functions
function successHandle (json) {
    console.log("Success" , json);
}
function errorHandle (err) {
    console.err("Error! Failed to load All meditications" + err);
}
//End Success & Error handle functions

// this function takes a single medication and renders it to the page
function renderMedication(medication) {
  console.log('rendering medication:', medication);
  var medicationHtml = $('#medication-template').html();
  var medicationsTemplate = Handlebars.compile (medicationHtml);
  var html = medicationsTemplate(medication);
  $('#medications').append(html);
}

function renderReview(review) {
  var reviewHtml = $('#review-template').html();
  var reviewsTemplate = Handlebars.compile (reviewHtml);
  var html = reviewsTemplate(review);
  $('#review').append(html);
}

//end function

//Document ready
$(document).ready(function() {
  console.log("app.js is Loaded & Running");
  // End document ready


  //Click to read review
  $(document).on('click', '.read button', function (event){
    var drugName = this.getAttribute("data-name");
    var url = '/api/reviews/' + drugName;
    $("#readModal .modal-title-drugName").html(drugName);
    $('#review').html('');
    $.get(url).success(function (reviews) {
        reviews.forEach(function(review) {
          renderReview (review);
        });
    });
  });


  // Post new review
  $(document).on('click', '.write button', function (event){
      $('#ratingInput').val("");
      $('#sideEffectsInput').val("");
      $('#ageInput').val("");
      $('#commentsInput').val("");
      var drugName = this.getAttribute("data-name");
      $("#writeModal .modal-title-drugName").html(drugName);
  });
// Save new review
  $(document).on('click', '#saveReviewButton', function (e){
    e.preventDefault();
    var review = {};
    review.ratings = $('#ratingInput').val();
    review.sideEffects = $('#sideEffectsInput').val();
    review.ageGroups = $('#ageInput').val();
    review.additionalComments = $('#commentsInput').val();
    review.medication = $('#writeModal .modal-title-drugName').html();
    $.ajax({
      method: 'POST',
      url: '/api/reviews',
      data: review,
      success: function(data) {console.log(data);},
      error: function(err) {console.err(err);},
      });
  });


// Delete review
  $(document).on('click', '.trashIcon', function() {
    var variableTrash = this;
    $.ajax({
      method: 'DELETE',
      url: '/api/reviews/' + $(this).attr('data-id'),
      success: function(data) {$(variableTrash).parent().remove();},
      error: function(err) {console.err(err);},
    });
  });

//Update review
//if click on "update" write modal pops up to edit & populated field. Hit Save.
$(document).on('click', '.updateIcon', function() {
  var visible = $(this).parent().find(".visible");
  var hidden = $(this).parent().find(".hidden");
  visible.removeClass("visible");
  hidden.removeClass("hidden");
  visible.addClass("hidden");
  hidden.addClass("visible");
});
// Save new review
  $(document).on('click', '#updateReviewButton', function (e){
    e.preventDefault();
    var review = {};
    review.ratings = $(this).parent().find('#updateRatingInput').val();
    review.sideEffects = $(this).parent().find('#updateSideEffectsInput').val();
    review.ageGroups = $(this).parent().find('#updateAgeInput').val();
    review.additionalComments = $(this).parent().find('#updateCommentsInput').val();
    $.ajax({
      method: 'PUT',
      url: '/api/reviews/' + $(this).attr('data-id'),
      data: review ,
      success: function(data) {console.log(data);},
      error: function(err) {console.err(err);},
    });
  });



  //Render single medication
  // renderMedication(medicationsList[0]);

  //Render all medications
  $.get('/api/medications').success(function (medications) {
      medications.forEach(function(medication) {
        renderMedication(medication);
      });
  });
});
