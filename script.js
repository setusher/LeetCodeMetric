document.addEventListener("DOMContentLoaded", function(){
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy_progress");
    const mediumProgressCircle = document.querySelector(".medium_progress");
    const hardProgressCircle = document.querySelector(".hard_progress");

    const easyLabel = document.getElementById("easy_label");
    const mediumLabel = document.getElementById("medium_label");
    const hardLabel = document.getElementById("hard_label");
    const cardStatsContainer = document.querySelector(".stats-cards");


    function validateUsername(username){
        if(username.trim() === ""){
            alert("username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{3,20}$/;
        const isMatching = regex.test(username);

        if(!isMatching){
            alert("Invalid username");
        }

        return isMatching;
    }

    async function fetchUserDetails(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch user details");
            }

            const parsedData = await response.json();
            console.log("data: ", parsedData);
            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }

    }
    
   
    function updateProgress(solved, total, label, circle) {
        if (total === 0) {
            label.textContent = "0/0";
            return;
        }
        const progressDegree = (solved / total) * 100;
        console.log(`Updating progress for ${label.id}: ${solved}/${total} -> ${progressDegree}%`);
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    

    function displayUserData(parsedData) {
        
    
        const totalQues = parsedData.totalQuestions;
        const totaleasyQues = parsedData.totalEasy;
        const totalmediumQues = parsedData.totalMedium;
        const totalhardQues = parsedData.totalHard;
    
        const solvedTotalQues = parsedData.totalSolved;
        const solvedEasyQues = parsedData.easySolved;
        const solvedMediumQues = parsedData.mediumSolved;
        const solvedHardQues = parsedData.hardSolved;
    
        console.log("Total Questions:", totalQues);
        console.log("Easy Solved:", solvedEasyQues, "/", totaleasyQues);
        console.log("Medium Solved:", solvedMediumQues, "/", totalmediumQues);
        console.log("Hard Solved:", solvedHardQues, "/", totalhardQues);
    
        updateProgress(solvedEasyQues, totaleasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMediumQues, totalmediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHardQues, totalhardQues, hardLabel, hardProgressCircle);

        const cardsData = [
            {label: "Acceptance Rate: ", value:parsedData.acceptanceRate},
            {label: "Ranking: ", value:parsedData.ranking},
            {label: "ContributionPoints: ", value:parsedData.contributionPoints},
            {label: "Reputation: ", value:parsedData.reputation},
        ];
    

        console.log("cardData: ", cardsData);

        if (cardStatsContainer) {
    cardStatsContainer.innerHTML = cardsData.map(data => `
        <div class="card">
            <h4>${data.label}</h4>
            <p>${data.value}</p>
        </div>
    `).join("");
} else {
    console.error("Error: .stats_cards container not found in the DOM");
}

    }
 

    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        console.log("logging username: ", username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
    })