//-------Song Submission---------
document.getElementById("addSongSubmit").addEventListener("click", function(event) {
  let hasErrors = checkSongSubmitForm();

  if(hasErrors)
  {
    event.preventDefault();
  }
});

function checkSongSubmitForm() {
  const errorMessages = [];

  let songNameEntry = document.getElementById("submitSongName");

  if(songNameEntry.value.length < 1)
  {
    errorMessages.push("Missing Song Name");
    songNameEntry.classList.add("error");  
  }

  let songArtistNameEntry = document.getElementById("submitSongArtistName");

  if(songArtistNameEntry.value.length < 1)
  {
    errorMessages.push("Missing Artist Name");
    songArtistNameEntry.classList.add("error");  
  }

  let songYoutubeURLEntry = document.getElementById("submitSongYoutubeURL");

  if(!(songYoutubeURLEntry.value == undefined || songYoutubeURLEntry.value == "") && !(validateYouTubeUrl(songYoutubeURLEntry.value)))
  {
    errorMessages.push("Youtube URL not valid.");
    songYoutubeURLEntry.classList.add("error");
  }

  let formErrorElement = document.getElementById("submitSongErrors");

  if(errorMessages.length > 0)
  {
    formErrorElement.classList.remove("hide");

    let html = "<ol>";

    errorMessages.forEach(errorMessage => {
        html += "<li>" + errorMessage + "</li>";
    });

    html += "</ol>";

    formErrorElement.innerHTML = html;

    return true;
  }
  else
  {
    songNameEntry.classList.remove("error");
    songArtistNameEntry.classList.remove("error");
    songYoutubeURLEntry.classList.remove("error");
    
    formErrorElement.classList.add("hide");

    return false;
  }
}

function validateYouTubeUrl(youtubeURL)
{
  var url = youtubeURL;

  if (!(url == undefined || url == '')) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
          // Do anything for being valid
          return true;
      }
      else {
          return false;
      }
  }

  return false;
}

//-------Artist Submission---------

document.getElementById("addArtistSubmit").addEventListener("click", function(event) {
  let hasErrors = checkArtistSubmitForm();

  if(hasErrors)
  {
    event.preventDefault();
  }
});

function checkArtistSubmitForm() {
  const errorMessages = [];

  let artistNameEntry = document.getElementById("submitArtistName");

  if(artistNameEntry.value.length < 1)
  {
    errorMessages.push("Missing Artist Name");
    artistNameEntry.classList.add("error");  
  }
  
  let artistImageURLEntry = document.getElementById("submitArtistImage");

  if (!(artistImageURLEntry.value == undefined || artistImageURLEntry.value == '') && !checkImageURL(artistImageURLEntry.value)) 
  {
    errorMessages.push("Missing Artist Name");
    artistImageURLEntry.classList.add("error");  
  }

  let formErrorElement = document.getElementById("submitArtistErrors");

  if(errorMessages.length > 0)
  {
    formErrorElement.classList.remove("hide");

    let html = "<ol>";

    errorMessages.forEach(errorMessage => {
        html += "<li>" + errorMessage + "</li>";
    });

    html += "</ol>";

    formErrorElement.innerHTML = html;

    return true;
  }
  else
  {
    songNameEntry.classList.remove("error");
    artistImageURLEntry.classList.remove("error");
    
    formErrorElement.classList.add("hide");

    return false;
  }
}

function checkImageURL(imageURL)
{
  if (!imageURL) return false
    else {
        const pattern = new RegExp('^https?:\\/\\/.+\\.(png|jpg|jpeg|bmp|gif|webp)$', 'i');
        return pattern.test(url);
    }
}

//-------Song Deletion---------

document.getElementById("removeSongSubmit").addEventListener("click", function(event) {
  let hasErrors = checkRemoveSongSubmitForm();

  if(hasErrors)
  {
    event.preventDefault();
  }
});

function checkRemoveSongSubmitForm() {
  const errorMessages = [];

  let songNameEntry = document.getElementById("removeSongName");

  if(songNameEntry.value.length < 1)
  {
    errorMessages.push("Missing Song Name");
    songNameEntry.classList.add("error");  
  }

  let songArtistNameEntry = document.getElementById("removeSongArtistName");

  if(songArtistNameEntry.value.length < 1)
  {
    errorMessages.push("Missing Artist Name");
    songArtistNameEntry.classList.add("error");  
  }

  let formErrorElement = document.getElementById("removeSongErrors");

  if(errorMessages.length > 0)
  {
    formErrorElement.classList.remove("hide");

    let html = "<ol>";

    errorMessages.forEach(errorMessage => {
        html += "<li>" + errorMessage + "</li>";
    });

    html += "</ol>";

    formErrorElement.innerHTML = html;

    return true;
  }
  else
  {
    songNameEntry.classList.remove("error");
    songArtistNameEntry.classList.remove("error");
    
    formErrorElement.classList.add("hide");

    return false;
  }
}

//-------Artist Deletion---------

document.getElementById("removeArtistSubmit").addEventListener("click", function(event) {
  let hasErrors = checkRemoveArtistSubmitForm();

  if(hasErrors)
  {
    event.preventDefault();
  }
});

function checkRemoveArtistSubmitForm() {
  const errorMessages = [];

  let artistNameEntry = document.getElementById("removeArtistName");

  if(artistNameEntry.value.length < 1)
  {
    errorMessages.push("Missing Artist Name");
    artistNameEntry.classList.add("error");  
  }

  let formErrorElement = document.getElementById("removeArtistErrors");

  if(errorMessages.length > 0)
  {
    formErrorElement.classList.remove("hide");

    let html = "<ol>";

    errorMessages.forEach(errorMessage => {
        html += "<li>" + errorMessage + "</li>";
    });

    html += "</ol>";

    formErrorElement.innerHTML = html;

    return true;
  }
  else
  {
    artistNameEntry.classList.remove("error");
    
    formErrorElement.classList.add("hide");

    return false;
  }
}