// language=HTML
export const ProductListHTML = `
  <head>
    <title>Product List</title>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
  </head>
    
  <style>
    body {
      margin: 0;
      width: 100%;
      min-height: 100vh;
      font-family: 'Helvetica Neue', 'Helevetica', 'Arial', 'sans-serif';
      
      color: white;
      background: white;
    }
    
    .row-header {
      color: #2d2d30;
      font-weight: 500;
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 18px;
    }
    
    .subtitle {
       color: #2d2d30;
    }
    
    .price {
       color: #bbb;
    }
    
    .container {
      padding: 2em;
    }
    
    .grid {
      color: #444;
      background: #fff;
        
      display: grid;
      align-items: center;
      justify-content: flex-start;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      grid-gap: 1.5em 0.5em;
    }

    .grid-child {
      display: grid;
      justify-content: center;
    }
      
    .grid-child img {
      margin-bottom: 10px;
    }
  </style>

  <body>
     <div class="container">
       <div class="row-header">
         Clothing Set A
       </div>
      
      <div class="grid"></div>
         
       <div class="row-header">
         Luxury Set A
       </div>

       <div class="grid"></div>
    </div>
    
    <script>
      function applyGrid(grid) {
        for (let i = 0; i <= 10; i++) {
          // language=html
          grid.innerHTML += \`
            <div class="grid-child">
              <div>
                <img src="\${randomImage(200, 200)}" />
              </div>
              <div class="subtitle">
                 Grandad shirt Regular Fit
              </div>
              <div class="price">
                 ฿12.99
              </div>
            </div>
          \`
        }
      }
        
      Array.from(document.querySelectorAll('.grid')).forEach(applyGrid)
    </script>
  </body>
`