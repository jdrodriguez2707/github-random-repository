document.addEventListener("DOMContentLoaded", async () => {
  // Programming languages select
  const programmingLanguagesSelect = document.querySelector(
    "#programming-languages"
  );

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    );
    const programmingLanguages = await response.json();
    console.log(programmingLanguages);

    programmingLanguages.forEach((programmingLanguage) => {
      const option = document.createElement("option");
      option.value = programmingLanguage.value;
      option.textContent = programmingLanguage.title;

      programmingLanguagesSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }

  programmingLanguagesSelect.addEventListener("change", onSelectChange);
});

const onSelectChange = async (event) => {
  console.log("Select changed!");
  console.log(event.currentTarget.value);
  const programmingLanguageSelected = event.currentTarget.value;

  // Request states
  const requestStatesDiv = document.querySelector("#request-state");
  const requestStateText = requestStatesDiv.firstElementChild;
  requestStateText.textContent = "Loading, please wait...";

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=language:${programmingLanguageSelected}&sort=stars&order=desc`
    );
    const repositories = await response.json();

    const repositoryName =
      repositories.items[getRandomIndex(repositories.items.length)].name;

    const repositoryDescription =
      repositories.items[getRandomIndex(repositories.items.length)].description;

    const repositoryLanguage =
      repositories.items[getRandomIndex(repositories.items.length)].language;

    requestStatesDiv.removeChild(requestStateText);
  } catch (error) {
    console.log(error);
  }
};

function getRandomIndex(arrayLength) {
  return Math.floor(Math.random() * arrayLength);
}
