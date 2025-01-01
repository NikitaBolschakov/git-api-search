const input = document.querySelector(".input");
const additionsList = document.querySelector(".additions-list");
const reposList = document.querySelector(".repos-list");

async function inputHandler() {
  const query = input.value.trim(); //тело запроса

  try {
    //если запрос больше двух символов
    if (query.length > 1) {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${query}`
      ); //ответ
      const data = await response.json(); //тело ответа

      additionsList.style.display = "block"; //возвращаем подсказки
      additionsList.innerHTML = ""; //очищаем список подсказок

      if (data.items) {
        const dataSlice = data.items.slice(0, 5); //лимитируем список подсказок

        dataSlice.forEach((repo) => {
          console.log(repo)
          const item = document.createElement("li"); //coздаем DOM элемент списка
          item.textContent = repo.name; //имя репозитория вставляеем текстом
          additionsList.appendChild(item); //добавляем элемент в DOM

          //слушатель на подсказке
          item.addEventListener("click", () => {
            addRepo(repo); //добавляем репо в список
            input.value = ''; //очищаем поле
            additionsList.style.display = "none"; //прячем подсказки
          });
        });
      }
    } else {
      additionsList.style.display = "none"; //прячем подсказки
    }
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Произошла ошибка при загрузке данных. Пожалуйста, попробуйте еще раз.");
  }
}

//функция добавления репо в список
function addRepo(repo) {
  const li = document.createElement("li");

  li.insertAdjacentHTML(
    "afterbegin",
    `<div class="repo">
      <div class="text">Name: ${repo.name}<br>Owner: ${repo.owner.login}<br>Stars: ${repo.stargazers_count}</div>
      <button class="remove-btn">Удалить</button>
    </div>`
  );

  const removeBtn = li.querySelector(".remove-btn");
  // функция обработчик кнопки удаления
  const handleRemove = () => {
    removeBtn.removeEventListener("click", handleRemove); //удаляем слушатель перед удалением
    reposList.removeChild(li); //удаляем элемент из списка
  };

  //слушатель на кнопке удаления
  removeBtn.addEventListener("click", handleRemove); 

  reposList.appendChild(li); //добавление элемента в DOM
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

input.addEventListener("input", debounce(inputHandler, 500));
