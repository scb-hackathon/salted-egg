export const PaymentRedirectHTML = `
  <title>Taking You to Payment - PromptPal</title>
    
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    
      margin: 0;
      width: 100%;
      min-height: 100vh;
      
      color: white;
      background: #4b2785;
    }
    
    h1 {
      font-size: 4em;
      font-weight: 300;
      text-align: center;
      font-family: 'Helvetica Neue', 'Helevetica', 'Arial', 'sans-serif';
    }
    
    .loader,.loader:after{border-radius:50%;width:10em;height:10em}.loader{margin:60px auto;font-size:10px;position:relative;text-indent:-9999em;border-top:1.1em solid rgba(255,255,255,.2);border-right:1.1em solid rgba(255,255,255,.2);border-bottom:1.1em solid rgba(255,255,255,.2);border-left:1.1em solid #fff;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation:load8 1.1s infinite linear;animation:load8 1.1s infinite linear}@-webkit-keyframes load8{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes load8{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}
  </style>

  <body>
    <div class="loader">&nbsp;</div>
    <h1>Taking You to Payment...</h1>
  </body>

  <script>
    setTimeout(function() {
      window.location.href = "{{DECODED}}"
    }, 500)
  </script>
`