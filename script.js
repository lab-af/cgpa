function generateCourseInputs() {
    let numCourses = parseInt(document.getElementById("numCourses").value);
    let container = document.getElementById("coursesContainer");
    container.innerHTML = ""; 

    for (let i = 0; i < numCourses; i++) {
        container.innerHTML += `
            <div class="course-block" id="courseBlock${i}">
                <h4>Course ${i + 1}</h4>
                <label>Credit:</label>
                <input type="number" id="credit${i}" min="1" step="0.5" oninput="updateFields(${i})">
                <div id="marksInput${i}"></div>
            </div>
        `;
    }
}

function updateFields(index) {
    let credit = parseFloat(document.getElementById(`credit${index}`).value);
    let marksDiv = document.getElementById(`marksInput${index}`);

    if (credit >= 3) {
        marksDiv.innerHTML = `
            <label>CT1 (10):</label><input type="number" id="ct1_${index}" min="0" max="10">
            <label>CT2 (10):</label><input type="number" id="ct2_${index}" min="0" max="10">
            <label>CT3 (10):</label><input type="number" id="ct3_${index}" min="0" max="10">
            <label>CT4 (10):</label><input type="number" id="ct4_${index}" min="0" max="10">
            <label>Midterm (20):</label><input type="number" id="midterm_${index}" min="0" max="20">
            <label>Assignment (10):</label><input type="number" id="assignment_${index}" min="0" max="10">
            <label>Attendance (10):</label><input type="number" id="attendance_${index}" min="0" max="10">
            <label>Final Exam (100):</label><input type="number" id="final_${index}" min="0" max="100">
        `;
    } else {
        marksDiv.innerHTML = `
            <label>Quiz (20):</label><input type="number" id="quiz_${index}" min="0" max="20">
            <label>Lab Report (10):</label><input type="number" id="lab_${index}" min="0" max="10">
            <label>Assignment (10):</label><input type="number" id="assignment_${index}" min="0" max="10">
            <label>Attendance (10):</label><input type="number" id="attendance_${index}" min="0" max="10">
            <label>Final Exam (40):</label><input type="number" id="final_${index}" min="0" max="40">
        `;
    }
}

function updateFields(index) {
    let credit = parseFloat(document.getElementById(`credit${index}`).value);
    let marksDiv = document.getElementById(`marksInput${index}`);

    if (credit >= 3) {
        marksDiv.innerHTML = `
            <label>CT1 (10):</label><input type="number" id="ct1_${index}" min="0" max="10">
            <label>CT2 (10):</label><input type="number" id="ct2_${index}" min="0" max="10">
            <label>CT3 (10):</label><input type="number" id="ct3_${index}" min="0" max="10">
            <label>CT4 (10):</label><input type="number" id="ct4_${index}" min="0" max="10">
            <label>Midterm (20):</label><input type="number" id="midterm_${index}" min="0" max="20">
            <label>Assignment (10):</label><input type="number" id="assignment_${index}" min="0" max="10">
            <label>Attendance (10):</label><input type="number" id="attendance_${index}" min="0" max="10">
            <label>Final Exam (100):</label><input type="number" id="final_${index}" min="0" max="100">
        `;
    } else {
        marksDiv.innerHTML = `
            <label>Quiz (20):</label><input type="number" id="quiz_${index}" min="0" max="20">
            <label>Lab Report (10):</label><input type="number" id="lab_${index}" min="0" max="10">
            <label>Assignment (10):</label><input type="number" id="assignment_${index}" min="0" max="10">
            <label>Attendance (10):</label><input type="number" id="attendance_${index}" min="0" max="10">
            <label>Viva (10):</label><input type="number" id="viva_${index}" min="0" max="10">
            <label>Final Exam (40):</label><input type="number" id="final_${index}" min="0" max="40">
        `;
    }
}

function calculateCGPA() {
    let numCourses = parseInt(document.getElementById("numCourses").value);
    let totalCredits = parseFloat(document.getElementById("totalCredits").value);
    let totalPoints = 0;

    for (let i = 0; i < numCourses; i++) {
        let credit = parseFloat(document.getElementById(`credit${i}`).value);
        let totalScore = 0;

        if (credit >= 3) {
            let ct1 = parseFloat(document.getElementById(`ct1_${i}`).value) || 0;
            let ct2 = parseFloat(document.getElementById(`ct2_${i}`).value) || 0;
            let ct3 = parseFloat(document.getElementById(`ct3_${i}`).value) || 0;
            let ct4 = parseFloat(document.getElementById(`ct4_${i}`).value) || 0;
            let midterm = parseFloat(document.getElementById(`midterm_${i}`).value) || 0;
            let assignment = parseFloat(document.getElementById(`assignment_${i}`).value) || 0;
            let attendance = parseFloat(document.getElementById(`attendance_${i}`).value) || 0;
            let finalExam = parseFloat(document.getElementById(`final_${i}`).value) || 0;

            // Taking the best 3 CTs
            let ctMarks = [ct1, ct2, ct3, ct4].sort((a, b) => b - a).slice(0, 3);
            let ctAvg = (ctMarks.reduce((sum, mark) => sum + mark, 0)) / 3;
            let finalScore = finalExam * 0.5;

            // Total score calculation for 3-credit courses
            totalScore = ctAvg + midterm + assignment + attendance + finalScore;
        } else {
            let quiz = parseFloat(document.getElementById(`quiz_${i}`).value) || 0;
            let labReport = parseFloat(document.getElementById(`lab_${i}`).value) || 0;
            let assignment = parseFloat(document.getElementById(`assignment_${i}`).value) || 0;
            let attendance = parseFloat(document.getElementById(`attendance_${i}`).value) || 0;
            let viva = parseFloat(document.getElementById(`viva_${i}`).value) || 0;
            let finalExam = parseFloat(document.getElementById(`final_${i}`).value) || 0;

            // Total score calculation for less than 3-credit courses
            totalScore = quiz + labReport + assignment + attendance + viva + finalExam;
        }

        // Convert total score to GPA
        let gpa = calculateGPA(totalScore);
        totalPoints += gpa * credit;
    }

    // Final CGPA Calculation
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


