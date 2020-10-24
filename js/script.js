document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const overlay = document.querySelector(".overlay");
  const quiz = document.querySelector(".quiz");
  const btnStartTest = document.querySelector(".pass-test__button");
  const form = document.querySelector(".quiz-body__form");
  const formItems = form.querySelectorAll("fieldset");
  const inputs = document.querySelectorAll("input");
  const btnsNext = document.querySelectorAll(".form-button__btn-next");
  const btnsPrev = document.querySelectorAll(".form-button__btn-prev");
  const formTitles = document.querySelectorAll(".form__title");

  const playQuiz = () => {
    const answers = {
      step0: {
        question: "",
        answers: [],
      },
      step1: {
        question: "",
        answers: [],
      },
      step2: {
        question: "",
        answers: [],
      },
      step3: {
        question: "",
        answers: [],
      },
      step4: {
        name: "",
        phone: "",
        email: "",
        call: "",
      },
    };

    btnsNext.forEach((btn, i) => {
      btn.disabled = true;

      btn.addEventListener("click", (event) => {
        event.preventDefault();

        formItems[i].style.display = "none";
        formItems[i + 1].style.display = "block";
      });
    });

    btnsPrev.forEach((btn, i) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();

        formItems[i + 1].style.display = "none";
        formItems[i].style.display = "block";
      });
    });

    formItems.forEach((formItem, formItemIndex) => {
      const actualAnswer = answers[`step${formItemIndex}`];

      if (formItemIndex === 0) {
        formItem.style.display = "block";
      } else {
        formItem.style.display = "none";
      }

      if (formItemIndex !== formItems.length - 1) {
        actualAnswer.question = formTitles[formItemIndex].textContent;

        formItem.addEventListener("change", (event) => {
          const target = event.target;
          const inputsCheck = formItem.querySelectorAll("input:checked");

          if (inputsCheck.length > 0) {
            btnsNext[formItemIndex].disabled = false;
          } else {
            btnsNext[formItemIndex].disabled = true;
          }

          actualAnswer.answers.length = 0;
          inputsCheck.forEach((input) => {
            actualAnswer.answers.push(input.value);
          });

          if (target.classList.contains("form__radio")) {
            const radios = formItem.querySelectorAll(".form__radio");

            radios.forEach((item) => {
              if (item === target) {
                target.parentNode.classList.add("active-radio");
              } else {
                item.parentNode.classList.remove("active-radio");
              }
            });
          } else if (target.classList.contains("form__input")) {
            target.parentNode.classList.toggle("active-checkbox");
          } else {
            return;
          }
        });
      }
    });

    inputs.forEach((input) => {
      const parent = input.parentNode;
      input.checked = false;
      parent.classList.remove("active-radio");
      parent.classList.remove("active-checkbox");
    });

    const sendForm = () => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (document.getElementById("quiz-policy").checked) {
          answers["step4"].name = document.getElementById("quiz-name").value;
          answers["step4"].phone = document.getElementById("quiz-phone").value;
          answers["step4"].email = document.getElementById("quiz-email").value;
          answers["step4"].call = document.getElementById("quiz-call").value;

          postData(answers).then((data) => {
            if (data["status"] === "ok") {
              overlay.style.display = "none";
              quiz.style.display = "none";

              alert(data["message"]);
            } else if (data["status"] === "error") {
              alert(data["message"]);
            }
          });
        } else {
          alert("согласитесь с условиями");
        }
      });

      const postData = (body) => {
        return fetch("./server.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      };
    };

    sendForm();
  };

  overlay.style.display = "none";
  quiz.style.display = "none";

  btnStartTest.addEventListener("click", () => {
    overlay.style.display = "block";
    quiz.style.display = "block";
    playQuiz();
  });
});
