function send_mail(emailaddress, subject, content) {
    fetch("mailer.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailaddress: emailaddress,
            subject: subject,
            content: content
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Email sent successfully:", data);
    })
    .catch(error => {
        console.error("Error sending email:", error);
    });
}



function print_preview(divID){
  var content = $(divID).html();
    var mywindow = window.open('', 'Print', 'height=600,width=800');

    mywindow.document.write('<html><head><title>Print</title>');
    mywindow.document.write(
      '<link href="css/bootstrap-icons.css" rel="stylesheet">'+
      '<link href="css/bootstrap.css" rel="stylesheet">'+
      '<link href="css/fontawesome-all.css" rel="stylesheet">'+
      '<link href="css/swiper.css" rel="stylesheet">'+
      '<link href="css/styles.css" rel="stylesheet">'+
    '<script src="s/bootstrap.min.js"></script>'
  );
    mywindow.document.write('</head><body style="-webkit-print-color-adjust:exact;">');
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();

    setTimeout(function(){
        mywindow.print();
        // mywindow.close();
    },1500)
    return true;
}



function toggle_popover($element, $title, $text, $placement){

  if($placement == undefined){
    $placement = "top";
  }

  $element
  .attr("date-toggle", "popover")
  .attr("date-original-title", $title)
  .attr("data-content", $text)
    .popover({ 
      title: $title, 
      content: $text,
      placement: $placement,
      html: true
    }).blur(function () {
        $(this).popover('hide');
    }).popover("show")
    .focus();
}


function jq_escape( variable ) { 
    return  variable.replace(/["']/g, "\\$&"); 
}

function jq_tag_escape(variable){
    return variable.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function jq_number_format(number, step){
  return parseFloat(number).toFixed(step).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function jq_number_format_precision(number, step){
  return (Math.floor(100 * parseFloat(number)) / 100).toFixed(step).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function jq_number_trim(number){
  return $.trim(number).replace(/,/g,"");
}
function append_nativeattachment(divID, definer, autoProcessQueue, parentdirectory, directory, tablename, primaryfield, primaryvalue, approveorder, fromparentdirectory, fromdirectory, temp){

  $.post("nativeattachments/nativeattachments.php",{
    divID             : divID,
    definer           : definer,
    autoProcessQueue  : autoProcessQueue,
    directory         : directory,
    tablename         : tablename,
    primaryfield      : primaryfield,
    primaryvalue      : primaryvalue,
    parentdirectory   : parentdirectory,
    approveorder      : approveorder,
    fromparentdirectory: fromparentdirectory,
    fromdirectory     : fromdirectory,
    temp     : temp
  }, function($attachments){
      $("#"+divID).html($attachments);
  })

}

function filter_datalist(datalistid, value, attribute){
    return $(datalistid).find("option")
    .filter(function(){
      return $(this).val().toUpperCase() == value.toUpperCase();
    }).attr(attribute);
}


$(function () {
  $('[data-toggle="popover"]').popover();
})


$(document).on("click", function(){
  $("[data-toggle='popover']").popover("hide");
})




function getLocation(latid, longid) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        $(latid).val(latitude);
        $(longid).val(longitude);

        console.log(latitude, longitude);

    }, showError);
  } else {
    // x.innerHTML = "Geolocation is not supported by this browser.";
    alert("not supported");
  }
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      var x  = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      var x  = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      var x  = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      var x  = "An unknown error occurred."
      break;
  }

  return x;

}


function show_location_error(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      var x  = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      var x  = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      var x  = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      var x  = "An unknown error occurred."
      break;
  }

  alert(x);

}

  
  function toast_alert($type, $title){
    // $type success, info, error, warning, question
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000
    });


    Toast.fire({
      icon: $type,
      title: $title
    })

  }