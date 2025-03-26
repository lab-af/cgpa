let mode = ""; // Stores the selected mode (FBS or FST)

function selectMode(selectedMode) {
    mode = selectedMode;
    document.getElementById("modeSelection").style.display = "none"; // Hide selection buttons
    document.getElementById("mainForm").style.display = "block"; // Show the input form
}

function generateCourseInputs() {
    let numCourses = parseInt(document.getElementById("numCourses").value);
    let container = document.getElementById("coursesContainer");
    container.innerHTML = "";

    for (let i = 0; i < numCourses; i++) {
        container.innerHTML += `
    <div class="course-block"> <!-- Ensure FST also uses this class -->
        <h4 class="course">Course ${i + 1}</h4>
        <label>Credit</label>
        <input type="number" id="credit${i}" min="0.5" step="0.5" oninput="updateFields(${i})">
        <div id="marksInput${i}"></div>
    </div>
`;

    }

    // Add "Calculate CGPA" button at the end of coursesContainer
    container.innerHTML += `
        <button onclick="calculateCGPA()" style="margin-top: 20px;">Calculate CGPA</button>
    `;
}


function updateFields(index) {
    let credit = parseFloat(document.getElementById(`credit${index}`).value);
    let marksDiv = document.getElementById(`marksInput${index}`);
    marksDiv.innerHTML = "";

    if (mode === "FBS") {
        // FBS Input Fields
        marksDiv.innerHTML = `
           
        <div class=" exp">
        <label>Class Test 1 </label><input type="number" id="ct1_${index}" min="0" max="2.5" placeholder=" Out of 2.5">
            <label> Class Test 2 </label><input type="number" id="ct2_${index}" min="0" max="2.5" placeholder=" Out of 2.5">
            <label>Class Test 3 </label><input type="number" id="ct3_${index}" min="0" max="2.5" placeholder=" Out of 2.5">
            <label>Class Test 4 </label><input type="number" id="ct4_${index}" min="0" max="2.5" placeholder=" Out of 2.5">
            <label>Term Paper </label><input type="number" id="term_${index}" min="0" max="10">
            <label>Assignment </label><input type="number" id="assignment_${index}" min="0" max="10">
            <label>Midterm </label><input type="number" id="midterm_${index}" min="0" max="10">
            <label>Attendance </label><input type="number" id="attendance_${index}" min="0" max="10">
            <label>Expected Final Exam Marks </label><input type="number" id="final_${index}" min="0" max="100" placeholder=" Out of 100" >
        </div>` ;
    } else {
        if (credit >= 3) {
            // FST (Regular Courses)
            marksDiv.innerHTML = `
                <label>Class Test 1 </label><input type="number" id="ct1_${index}" min="0" max="10">
                <label>Class Test 2 </label><input type="number" id="ct2_${index}" min="0" max="10">
                <label>Class Test 3 </label><input type="number" id="ct3_${index}" min="0" max="10">
                <label>Class Test 4 </label><input type="number" id="ct4_${index}" min="0" max="10">
                <label>Midterm </label><input type="number" id="midterm_${index}" min="0" max="20"  placeholder=" Out of 20">
                <label>Assignment </label><input type="number" id="assignment_${index}" min="0" max="10">
                <label>Attendance </label><input type="number" id="attendance_${index}" min="0" max="10">
                <label>Expected Final Exam Marks</label><input type="number" id="final_${index}" min="0" max="100" placeholder=" Out of 100" >
            `;
        } else {
            // FST (Less than 3 Credit Courses)
            marksDiv.innerHTML = `
                <label>Quiz </label><input type="number" id="quiz_${index}" min="0" max="20">
                <label>Lab Report </label><input type="number" id="lab_${index}" min="0" max="10">
                <label>Observation </label><input type="number" id="observation_${index}" min="0" max="10">
                <label>Viva </label><input type="number" id="viva_${index}" min="0" max="10">
                <label>Attendance </label><input type="number" id="attendance_${index}" min="0" max="10">
                <label>Expected Final Exam Marks </label><input type="number" id="final_${index}" min="0" max="40">
            `;
        }
    }
}

function calculateCGPA() {
    let numCourses = parseInt(document.getElementById("numCourses").value);
    let totalCredits = parseFloat(document.getElementById("totalCredits").value);
    let totalPoints = 0;

    for (let i = 0; i < numCourses; i++) {
        let credit = parseFloat(document.getElementById(`credit${i}`).value);
        let totalScore = 0;

        if (mode === "FBS") {
            // FBS Calculation
            let ct1 = parseFloat(document.getElementById(`ct1_${i}`).value) || 0;
            let ct2 = parseFloat(document.getElementById(`ct2_${i}`).value) || 0;
            let ct3 = parseFloat(document.getElementById(`ct3_${i}`).value) || 0;
            let ct4 = parseFloat(document.getElementById(`ct4_${i}`).value) || 0;
            let termPaper = parseFloat(document.getElementById(`term_${i}`).value) || 0;
            let assignment = parseFloat(document.getElementById(`assignment_${i}`).value) || 0;
            let midterm = parseFloat(document.getElementById(`midterm_${i}`).value) || 0;
            let attendance = parseFloat(document.getElementById(`attendance_${i}`).value) || 0;
            let finalExam = parseFloat(document.getElementById(`final_${i}`).value) || 0;

            let ctMarks = [ct1, ct2, ct3, ct4];
            let finalScore = finalExam * 0.4;

            totalScore = ctMarks.reduce((sum, mark) => sum + mark, 0) + termPaper + assignment + midterm + attendance + finalScore;
        } else {
            if (credit >= 3) {
                // FST Regular Calculation
                let ctMarks = ["ct1", "ct2", "ct3", "ct4"]
                    .map(id => parseFloat(document.getElementById(`${id}_${i}`).value) || 0)
                    .sort((a, b) => b - a)  // Sort in descending order
                    .slice(0, 3);  // Take the best 3

                let ctAvg = ctMarks.reduce((sum, mark) => sum + mark, 0) / 3;  // Average of best 3 CTs

                totalScore = ctAvg +
                    (parseFloat(document.getElementById(`midterm_${i}`).value) || 0) +
                    (parseFloat(document.getElementById(`assignment_${i}`).value) || 0) +
                    (parseFloat(document.getElementById(`attendance_${i}`).value) || 0) +
                    ((parseFloat(document.getElementById(`final_${i}`).value) || 0) * 0.5);

            } else {
                // FST Less than 3 Credits Calculation
                totalScore = ["quiz", "lab", "observation", "viva", "attendance", "final"]
                    .map(id => parseFloat(document.getElementById(`${id}_${i}`).value) || 0)
                    .reduce((sum, mark) => sum + mark, 0);
            }
        }

        let gpa = calculateGPA(totalScore);
        totalPoints += gpa * credit;
    }

    let cgpa = totalPoints / totalCredits;
    document.getElementById("result").innerText = `CGPA: ${cgpa.toFixed(2)}`;
}

// GPA Calculation Based on Marks
function calculateGPA(score) {
    if (score >= 80) return 4.0;
    if (score >= 75) return 3.75;
    if (score >= 70) return 3.5;
    if (score >= 65) return 3.25;
    if (score >= 60) return 3.0;
    if (score >= 55) return 2.75;
    if (score >= 50) return 2.5;
    if (score >= 45) return 2.25;
    if (score >= 40) return 2.0;
    return 0.0;
}