(function ($) {
  $(function () {
    
    const categories = [
      { id: "healthy", name: 'healthy', title: "Υγιεινά"},
      { id: "healthy1", name: 'healthy', title: "kati"},
      { id: "healthy2", name: 'healthy', title: "kati allo"},
    ];

    const products = [
      { id: "xarouposokolatompoukies", categoryId: "healthy", name: "xarouposokolatompoukies", title: "Χαρουποσοκολατομπουκιές", firstText: "Με χαρουπάλευρο, κακάο, μέλι, φυστικοβουτυρο, λάδι καρύδας και χυμό ανανά", secondText: "", photo: "images/xarouposokolatompoukies.jpg", tiles: "sugarfree;low calories;vegan;", price: "€3.50", href: "www.google.gr" },
      { id: "strawberry_boundy", categoryId: "healthy", name: "Strawberry boundy", title: "Strawberry boundy (5 pieces)", firstText: "Με ινδοκάρυδο, γάλα καρύδας light, λιωμένες φράουλες, μέλι και σοκολάτα για επικάλυψη", secondText: "", photo: "images/strawberryboundy.jpg", tiles: "sugarfree;low calories;chocolate;", price: "€4.00", href: "www.google.gr" },
      { id: "xarouposokolatompoukies", categoryId: "healthy1", name: "xarouposokolatompoukies", title: "Χαρουποσοκολατομπουκιές", firstText: "Με χαρουπάλευρο, κακάο, μέλι, φυστικοβουτυρο, λάδι καρύδας και χυμό ανανά", secondText: "", photo: "images/xarouposokolatompoukies.jpg", tiles: "sugarfree;low calories;vegan;", price: "€3.50", href: "www.google.gr" },
      { id: "strawberry_boundy", categoryId: "healthy1", name: "Strawberry boundy", title: "Strawberry boundy (5 pieces)", firstText: "Με ινδοκάρυδο, γάλα καρύδας light, λιωμένες φράουλες, μέλι και σοκολάτα για επικάλυψη", secondText: "", photo: "images/strawberryboundy.jpg", tiles: "sugarfree;low calories;chocolate;", price: "€4.00", href: "www.google.gr" },
      { id: "xarouposokolatompoukies", categoryId: "healthy2", name: "xarouposokolatompoukies", title: "Χαρουποσοκολατομπουκιές", firstText: "Με χαρουπάλευρο, κακάο, μέλι, φυστικοβουτυρο, λάδι καρύδας και χυμό ανανά", secondText: "", photo: "images/xarouposokolatompoukies.jpg", tiles: "sugarfree;low calories;vegan;", price: "€3.50", href: "www.google.gr" },
      { id: "strawberry_boundy", categoryId: "healthy2", name: "Strawberry boundy", title: "Strawberry boundy (5 pieces)", firstText: "Με ινδοκάρυδο, γάλα καρύδας light, λιωμένες φράουλες, μέλι και σοκολάτα για επικάλυψη", secondText: "", photo: "images/strawberryboundy.jpg", tiles: "sugarfree;low calories;chocolate;", price: "€4.00", href: "www.google.gr" },
    ];


    createProducts();

    function createProducts(){

      const cardsBody = document.getElementById('cards-body');
      const listCategories = document.getElementById('list-categories');

      // Clear existing content
      cardsBody.innerHTML = '';
      listCategories.innerHTML = '';
      
      // Group products by category
      const categoryMap = {};
      products.forEach(product => {
          if (!categoryMap[product.categoryId]) {
              categoryMap[product.categoryId] = [];
          }
          categoryMap[product.categoryId].push(product);
      });

      // Generate HTML dynamically
      let i = 1;
      categories.forEach(category => {
          if (!categoryMap[category.id]) return;

          const container = document.createElement('div');
          const li = document.createElement('li');
          const aTag = document.createElement('a');
          if (i!=1) {
            container.className = 'margin-top-250';
            li.className = 'border-t';
            li.href = '#'+category.id;
          }
          aTag.className = 'btn text-primary font-bold a-tag-category';

          cardsBody.appendChild(container);
          li.appendChild(aTag);
          listCategories.appendChild(li);

          // Create category section
          const categoryTitle = document.createElement('div');
          categoryTitle.className = 'category-title transition-all duration-1000 ease-out';
          categoryTitle.innerHTML = `
              <div class="py-05 margin-bottom-1 w-full border-b border-solid border-primary border-opacity-50">
                  <h1 id="${category.name}" class="text-primary font-bold text-xl">${category.title.toUpperCase()}</h1>
              </div>
          `;
          container.appendChild(categoryTitle);

          // Create grid container
          const gridContainer = document.createElement('div');
          gridContainer.className = 'grid grid-cols-2 gap-1';

          categoryMap[category.id].forEach(product => {
              // Create product card
              const cardContainer = document.createElement('div');
              cardContainer.className = 'card-container transition-all duration-1000 ease-out';

              const card = document.createElement('a');
              card.className = 'card transition-all duration-200 ease-in-out px-1 py-05 border-solid';
              card.href = product.href;

              card.innerHTML = `
                  <h1 class="font-semibold" id="${product.categoryId}">${product.title}</h1>
                  <div class="flex flex-wrap gap-025">
                      ${product.tiles.split(';').filter(tile => tile).map(tile => `
                          <div class="py-025 px-05 text-xs bg-primary text-primaryContent info-tile">
                              ${tile.toUpperCase()}
                          </div>`).join('')}
                  </div>
                  <div class="flex w-full h-full justify-between">
                      <div class="flex flex-col w-full pr-1 gap-05">
                          <p class="text-sm">${product.firstText}</p>
                      </div>
                      <div class="margin-top-05 self-center">
                          <img class="product-image" src="${product.photo}" width="400" height="200">
                      </div>
                  </div>
                  <div class="flex justify-between">
                      <div class="flex flex-col items-start">
                          <div class="margin-top-auto text-lg font-semibold text-primary inline-flex gap-05">
                              ${product.price}
                          </div>
                      </div>
                  </div>
              `;

              cardContainer.appendChild(card);
              gridContainer.appendChild(cardContainer);
          });

          container.appendChild(gridContainer);
          i++;
      });
    }
  
    $('#button-side-menu').on('click', function () {
      const sideContainerMenu = document.getElementById("side-container-menu");
      sideContainerMenu.classList.remove("displayBlock");
      sideContainerMenu.classList.add("displayNone");
    });

    $('#menu-icon').on('click', function () {
      const sideContainerMenu = document.getElementById("side-container-menu");
      console.log('kati');
      sideContainerMenu.classList.add("displayBlock");
      sideContainerMenu.classList.remove("displayNone");
    });
    
  });

  
  window.onclick = function(event) {
    var carouselModal = document.getElementById("carousel-modal-id");
    if (event.target == carouselModal) {
      carouselModal.remove();
      //carouselModal.style.display = "none";
    }
  } 
  
})(jQuery);
