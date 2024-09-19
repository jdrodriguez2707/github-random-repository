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

  programmingLanguagesSelect.addEventListener("change", fetchRandomRepository);
});

const fetchRandomRepository = async (event) => {
  // console.log("Select changed!");
  // console.log(event.currentTarget.value);
  let programmingLanguageSelected = "";

  // Request states
  const requestStatesDiv = document.querySelector("#request-state");

  if (requestStatesDiv.childElementCount > 1) {
    const programmingLanguagesSelect = document.querySelector(
      "#programming-languages"
    );

    programmingLanguageSelected = programmingLanguagesSelect.value;

    while (requestStatesDiv.firstChild) {
      requestStatesDiv.removeChild(requestStatesDiv.firstChild);
    }
  } else {
    programmingLanguageSelected = event.currentTarget.value;
    requestStatesDiv.removeChild(requestStatesDiv.firstElementChild);
  }

  const requestStateText = document.createElement("p");
  requestStateText.textContent = "Loading, please wait...";
  requestStateText.classList.add("request-state-text");
  requestStatesDiv.appendChild(requestStateText);

  try {
    const query = programmingLanguageSelected
      ? `language:${programmingLanguageSelected}`
      : "stars:>1";
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`
    );
    const data = await response.json();
    const repositories = data.items;
    const randomIndex = getRandomIndex(repositories.length);

    const repositoryName = repositories[randomIndex].name;
    const repositoryDescription = repositories[randomIndex].description;
    const repositoryLanguage = repositories[randomIndex].language;
    const repositoryStars = repositories[randomIndex].stargazers_count;
    const repositoryForks = repositories[randomIndex].forks;
    const repositoryOpenIssues = repositories[randomIndex].open_issues_count;

    console.log(
      `Name: ${repositoryName}\nDesc: ${repositoryDescription}\nLang: ${repositoryLanguage}\nStars: ${repositoryStars}\nForks: ${repositoryForks}\nIssues: ${repositoryOpenIssues}`
    );

    displayRandomRepository(
      requestStatesDiv,
      requestStateText,
      repositoryName,
      repositoryDescription,
      repositoryLanguage,
      repositoryStars,
      repositoryForks,
      repositoryOpenIssues
    );

    displayRefreshButton();
  } catch (error) {
    console.log(error);
  }
};

function getRandomIndex(arrayLength) {
  return Math.floor(Math.random() * arrayLength);
}

function displayRandomRepository(
  requestStatesDiv,
  requestStateText,
  name,
  description,
  language,
  stars,
  forks,
  openIssues
) {
  // Request states container
  requestStatesDiv.classList.add("fulfilled-state");
  requestStatesDiv.removeChild(requestStateText);

  // Repository name h2
  const repositoryName = document.createElement("h2");
  repositoryName.classList.add("repository-name");
  repositoryName.textContent = name;

  // Repository description paragraph
  const repositoryDescription = document.createElement("p");
  repositoryDescription.classList.add("repository-description");
  repositoryDescription.textContent = description;

  // Repository stats container
  const repositoryStatsContainer = document.createElement("div");
  repositoryStatsContainer.classList.add("repository-stats");

  // Repository language container
  const languageContainer = document.createElement("div");
  const repositoryLanguage = document.createElement("p");
  repositoryLanguage.innerText = language;
  languageContainer.appendChild(repositoryLanguage);

  // Repository stars container
  const starsContainer = document.createElement("div");
  starsContainer.classList.add("stats-with-icon-container");
  const starIcon = document.createElement("img");
  starIcon.classList.add("stats-icon");
  starIcon.src = "./assets/icons/star.svg";
  starIcon.alt = "GitHub stars";
  const repositoryStars = document.createElement("p");
  repositoryStars.textContent = stars;
  starsContainer.append(starIcon, repositoryStars);

  // Repository forks container
  const forksContainer = document.createElement("div");
  forksContainer.classList.add("stats-with-icon-container");
  const forksIcon = document.createElement("img");
  forksIcon.classList.add("stats-icon");
  forksIcon.src = "./assets/icons/git-fork.svg";
  forksIcon.alt = "GitHub forks";
  const repositoryForks = document.createElement("p");
  repositoryForks.textContent = forks;
  forksContainer.append(forksIcon, repositoryForks);

  // Repository open issues container
  const openIssuesContainer = document.createElement("div");
  openIssuesContainer.classList.add("stats-with-icon-container");
  const issuesIcon = document.createElement("img");
  issuesIcon.classList.add("stats-icon");
  issuesIcon.src = "./assets/icons/circle-alert.svg";
  issuesIcon.alt = "GitHub issues";
  const repositoryOpenIssues = document.createElement("p");
  repositoryOpenIssues.textContent = openIssues;
  openIssuesContainer.append(issuesIcon, repositoryOpenIssues);

  repositoryStatsContainer.append(
    languageContainer,
    starsContainer,
    forksContainer,
    openIssuesContainer
  );

  requestStatesDiv.append(
    repositoryName,
    repositoryDescription,
    repositoryStatsContainer
  );
}

function displayRefreshButton() {
  const refreshButton = document.querySelector("#retry-button");
  refreshButton.classList.remove("inactive");
  refreshButton.classList.add("refresh-background-color");
  refreshButton.textContent = "Refresh";

  const repositoryFinderForm = document.querySelector(
    "#repository-finder-form"
  );
  repositoryFinderForm.removeEventListener("submit", handleFormSubmit);
  repositoryFinderForm.addEventListener("submit", handleFormSubmit);
}

function handleFormSubmit(event) {
  event.preventDefault();
  fetchRandomRepository();
}
