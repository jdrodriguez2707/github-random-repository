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
    // console.log(programmingLanguages);

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
  const programmingLanguagesSelect = document.querySelector(
    "#programming-languages"
  );

  let programmingLanguageSelected = "";

  // Request states container
  const requestStatesDiv = document.querySelector("#request-state");

  // Remove previous repository data from the DOM if it exists (when the user clicked the refresh button)
  if (requestStatesDiv.childElementCount > 1) {
    while (requestStatesDiv.firstChild) {
      requestStatesDiv.removeChild(requestStatesDiv.firstChild);
    }

    programmingLanguageSelected = programmingLanguagesSelect.value;
  } else {
    // Remove "Select a language" option the first time the user selects a language
    programmingLanguagesSelect.removeChild(
      programmingLanguagesSelect.firstElementChild
    );
    programmingLanguageSelected = event.currentTarget.value;
    // Remove the loading text
    requestStatesDiv.removeChild(requestStatesDiv.firstElementChild);
  }

  // Add the loading text
  const requestStateText = document.createElement("p");
  requestStateText.textContent = "Loading, please wait...";
  requestStateText.classList.add("request-state-text");
  requestStatesDiv.classList.remove("error-state");
  requestStatesDiv.classList.remove("fulfilled-state");
  requestStatesDiv.classList.add("request-state");
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

    // console.log(
    //   `Name: ${repositoryName}\nDesc: ${repositoryDescription}\nLang: ${repositoryLanguage}\nStars: ${repositoryStars}\nForks: ${repositoryForks}\nIssues: ${repositoryOpenIssues}`
    // );

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
    // console.log(error);
    displayErrorState(requestStatesDiv, requestStateText);
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
  requestStatesDiv.classList.remove("error-state");
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

function displayRefreshButton(errorState) {
  const refreshButton = document.querySelector("#retry-button");
  refreshButton.classList.remove("inactive");

  if (errorState) {
    refreshButton.classList.remove("refresh-background-color");
    refreshButton.classList.add("button-error");
    refreshButton.textContent = "Click to retry";
  } else {
    refreshButton.classList.remove("button-error");
    refreshButton.classList.add("refresh-background-color");
    refreshButton.textContent = "Refresh";
  }

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

function displayErrorState(requestStatesDiv, requestStateText) {
  requestStatesDiv.classList.remove("fulfilled-state");
  requestStatesDiv.classList.add("error-state");
  requestStateText.textContent = "Error fetching repositories";
  const errorState = true;

  displayRefreshButton(errorState);
}
