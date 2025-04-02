document.addEventListener("DOMContentLoaded", () => {
    const templates = {
      notificationUI: {
        code: `
          <div class="notification" id="notification">
            <p>This is a notification!</p>
          </div>
          <button onclick="showNotification()">Show Notification</button>
          <script>
            function showNotification() {
              const notification = document.getElementById('notification');
              notification.classList.add('show');
              setTimeout(() => {
                notification.classList.remove('show');
              }, 3000);
            }
          </script>
        `,
        preview: `
          <div class="notification" id="notification">
            <p>This is a notification!</p>
          </div>
          <button onclick="showNotification()">Show Notification</button>
          <script>
            function showNotification() {
              const notification = document.getElementById('notification');
              notification.classList.add('show');
              setTimeout(() => {
                notification.classList.remove('show');
              }, 3000);
            }
          </script>
        `
      },
      clickerGame: {
        code: `
          <div class="clicker-game">
            <button class="clicker-button" id="clickerBtn">Click Me!</button>
            <p class="clicker-count" id="clickerCount">Clicks: 0</p>
          </div>
          <script>
            let count = 0;
            const clickerBtn = document.getElementById('clickerBtn');
            const clickerCount = document.getElementById('clickerCount');
            clickerBtn.addEventListener('click', () => {
              count++;
              clickerCount.textContent = 'Clicks: ' + count;
            });
          </script>
        `,
        preview: `
          <div class="clicker-game">
            <button class="clicker-button" id="clickerBtn">Click Me!</button>
            <p class="clicker-count" id="clickerCount">Clicks: 0</p>
          </div>
          <script>
            let count = 0;
            const clickerBtn = document.getElementById('clickerBtn');
            const clickerCount = document.getElementById('clickerCount');
            clickerBtn.addEventListener('click', () => {
              count++;
              clickerCount.textContent = 'Clicks: ' + count;
            });
          </script>
        `
      },
      // Add more templates in similar structure here...
    };
  
    function loadTemplate(template) {
      const previewContainer = document.getElementById("previewContainer");
      previewContainer.innerHTML = `
        <div class="template-preview">
          <h2>Preview:</h2>
          <div class="preview">${template.preview}</div>
        </div>
      `;
    }
  
    function addEventListeners() {
      document.getElementById('notificationUITemplateBtn').addEventListener('click', () => {
        loadTemplate(templates.notificationUI);
      });
      document.getElementById('clickerGameTemplateBtn').addEventListener('click', () => {
        loadTemplate(templates.clickerGame);
      });
      // Add event listeners for other templates here...
    }
  
    addEventListeners();
  });
  