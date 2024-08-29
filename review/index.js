const links = document.querySelectorAll('.nav__link');
const light = document.querySelector('.nav__light');

function moveLight({ offsetLeft, offsetWidth }) {
  light.style.left = `${offsetLeft - offsetWidth/4}px`;
}

function activeLink(linkActive) {
  links.forEach(link => {
    link.classList.remove('active');
    linkActive.classList.add('active');
  })
}


links.forEach((link) => {
  link.addEventListener('click', (event) => {
    moveLight(event.target);
    activeLink(link);
  })
})


function initClient() {
  gapi.client.init({
    apiKey: 'AIzaSyDPxjXYXHvmNU9eSD6LLPZvr7OPIj4KaKQ',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
  }).then(function () {
    loadSheetData();
  });
}

function loadSheetData() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1N6nkzgFgiqQ5dAIJeo1aIhwCoQezgUetYY1OSUX1a-U',
    range: '99miles', // Adjust this range as needed
  }).then(function (response) {
    const data = response.result.values;
    if (data && data.length) {
      displayData(data);
    } else {
      console.log('No data found.');
    }
  }, function (response) {
    console.error('Error: ' + response.result.error.message);
  });
}

function displayData(data) {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const rows = data.slice(1).reverse();
  rows.forEach(row => {
      const testimonialText = row[1]; // Assuming the testimonial text is in the first column
      const name = row[0]; // Assuming the name is in the second column
      const rating = row[2]; // Assuming the rating is in the third column
      const date = row[3]; // Assuming the rating is in the third column

      let stars = '';
      for (let i = 0; i < 5; i++) {
          if (i < rating) {
              stars += '<i class="fa-solid fa-star fa-xs text-warning"></i>';
          } else {
              stars += '<i class="fa-solid fa-star fa-xs text-muted"></i>';
          }
      }

      const slideHTML = `
          <div class="swiper-slide col-md-3">
              <div class="slider-wraapper">
              <div class="container">
              <div class="row"> 
               <div class="col-md-8"><h4 class="number text-muted" ><i class="fa-regular fa-address-book"></i> +91 ${name}</h4></div> 
               <div class="col-md-4"><p class="text-muted date" align="right">( ${date} )</p></div>
              </div>
              </div>
                  <h6 class="test">${testimonialText}</h6>                  
                  <div>
                      <div class="row">
                          <div class="col-12" align="center">
                              <h4>${stars}</h4>
                              
                          </div>

                      </div>
                  </div>
              </div>
          </div>
      `;

      swiperWrapper.innerHTML += slideHTML;
  });
}


document.addEventListener('DOMContentLoaded', function () {
  gapi.load('client', initClient);
});

document.getElementById('showReviewButton').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default anchor behavior
  const reviewSection = document.getElementById('reviewSection');
  document.getElementById('dash').style.display="none";
  reviewSection.style.display = 'block'; // Show the review section

  // Optionally, you could add code here to load or refresh the reviews
  // e.g., fetchDataAndDisplayReviews();
});
document.getElementById('dashbutton').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default anchor behavior
  const reviewSection = document.getElementById('dash');
  document.getElementById('reviewSection').style.display="none";
  reviewSection.style.display = 'block'; // Show the review section

  // Optionally, you could add code here to load or refresh the reviews
  // e.g., fetchDataAndDisplayReviews();
});


// function sliceSize(dataNum, dataTotal) {
//     return (dataNum / dataTotal) * 360;
//   }
//   function addSlice(sliceSize, pieElement, offset, sliceID, color) {
//     $(pieElement).append("<div class='slice "+sliceID+"'><span></span></div>");
//     var offset = offset - 1;
//     var sizeRotation = -179 + sliceSize;
//     $("."+sliceID).css({
//       "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
//     });
//     $("."+sliceID+" span").css({
//       "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
//       "background-color": color
//     });
//   }
//   function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
//     var sliceID = "s"+dataCount+"-"+sliceCount;
//     var maxSize = 179;
//     if(sliceSize<=maxSize) {
//       addSlice(sliceSize, pieElement, offset, sliceID, color);
//     } else {
//       addSlice(maxSize, pieElement, offset, sliceID, color);
//       iterateSlices(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
//     }
//   }
//   function createPie(dataElement, pieElement) {
//     var listData = [];
//     $(dataElement+" span").each(function() {
//       listData.push(Number($(this).html()));
//     });
//     var listTotal = 0;
//     for(var i=0; i<listData.length; i++) {
//       listTotal += listData[i];
//     }
//     var offset = 0;
//     var color = [
//       "cornflowerblue", 
//       "olivedrab", 
//       "orange", 
//       "tomato", 
//       "crimson", 
//       "purple", 
//       "turquoise", 
//       "forestgreen", 
//       "navy", 
//       "gray"
//     ];
//     for(var i=0; i<listData.length; i++) {
//       var size = sliceSize(listData[i], listTotal);
//       iterateSlices(size, pieElement, offset, i, 0, color[i]);
//       $(dataElement+" li:nth-child("+(i+1)+")").css("border-color", color[i]);
//       offset += size;
//     }
//   }
//   createPie(".pieID.legend", ".pieID.pie");
  