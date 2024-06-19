document.addEventListener("DOMContentLoaded", () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  const saveButton = document.querySelector(".save-button");
  const medicationInput = document.querySelector(".inputs");
  const timeInput = document.querySelector(".inputs2");
  const listContainer = document.querySelector(".listagem-container");

  let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

  // Carregar lembretes do localStorage ao iniciar
  reminders.forEach(addReminderToList);

  saveButton.addEventListener("click", () => {
    const medication = medicationInput.value;
    const time = timeInput.value;

    if (medication && time) {
      const reminder = {
        id: Date.now(),
        medication,
        time,
      };
      reminders.push(reminder);
      addReminderToList(reminder);
      saveReminders();
      medicationInput.value = "";
      timeInput.value = "";
    }
  });

  function addReminderToList(reminder) {
    const card = document.createElement("div");
    card.className = "cards";
    card.dataset.id = reminder.id;
    card.innerHTML = `
          <p>${reminder.medication}</p>
          <div>${reminder.time}</div>
          <button class="remove-button">Remover</button>
        `;
    listContainer.appendChild(card);

    const removeButton = card.querySelector(".remove-button");
    removeButton.addEventListener("click", () => {
      removeReminder(reminder.id);
    });
  }

  function removeReminder(id) {
    reminders = reminders.filter((reminder) => reminder.id !== id);
    saveReminders();
    const card = listContainer.querySelector(`.cards[data-id='${id}']`);
    if (card) {
      listContainer.removeChild(card);
    }
  }

  function saveReminders() {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }

  function checkReminders() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    reminders.forEach((reminder) => {
      if (reminder.time === currentTime) {
        notifyUser(reminder.medication);
      }
    });
  }

  function notifyUser(medication) {
    if (Notification.permission === "granted") {
      new Notification(`Hora de tomar o medicamento: ${medication}`);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(`Hora de tomar o medicamento: ${medication}`);
        }
      });
    }
  }

  setInterval(checkReminders, 5000);
});
