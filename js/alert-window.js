function showAlert(message, success = true) {
  const alertTemplate = `<div class="alert alert-dismissible ${success ? 'alert-success' : 'alert-danger'}" role="alert">
          <strong>${message}</strong> 
        </div>`;

  const alertElement = document.createElement('div');
  alertElement.innerHTML = alertTemplate;

  document.body.appendChild(alertElement);

  setTimeout(() => {
    alertElement.parentNode.removeChild(alertElement);
  }, 2000);
}
