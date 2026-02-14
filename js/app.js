// Firebase initialize
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');

// Data Save kora (Students Page-er jonno)
if(studentForm) {
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('stuName').value;
        const roll = document.getElementById('stuRoll').value;
        const className = document.getElementById('stuClass').value;

        database.ref('students/').push({
            name: name,
            roll: roll,
            class: className
        }).then(() => {
            alert("Student Data Saved!");
            studentForm.reset();
        });
    });
}

// Data Load kora Table-e
if(studentTableBody) {
    database.ref('students/').on('value', (snapshot) => {
        studentTableBody.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const student = childSnapshot.val();
            const row = `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.roll}</td>
                    <td>${student.class}</td>
                    <td><button onclick="deleteStudent('${childSnapshot.key}')" style="color:red; cursor:pointer;">Delete</button></td>
                </tr>
            `;
            studentTableBody.innerHTML += row;
        });
    });
}

// Delete Function
window.deleteStudent = (id) => {
    if(confirm("Delete this student?")) {
        database.ref('students/' + id).remove();
    }
}


// Dashboard-er Total Student count update
const totalStudentsCount = document.getElementById('totalStudentsCount');
if (totalStudentsCount) {
    database.ref('students/').on('value', (snapshot) => {
        // snapshot.numChildren() diye total koijon student ache ta pawa jay
        totalStudentsCount.innerText = snapshot.numChildren();
    });
}



// Dashboard Teachers Count
const totalTeachersDisplay = document.getElementById('totalTeachersCount'); // index.html-e ID-ta thik thakte hobe
if (totalTeachersDisplay) {
    database.ref('teachers/').on('value', (snapshot) => {
        totalTeachersDisplay.innerText = snapshot.numChildren();
    });
}


// --- Teacher Management Logic ---
const teacherForm = document.getElementById('teacherForm');
const teacherTableBody = document.getElementById('teacherTableBody');

if(teacherForm) {
    teacherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        database.ref('teachers/').push({
            name: document.getElementById('tName').value,
            designation: document.getElementById('tDesignation').value,
            subject: document.getElementById('tSubject').value
        }).then(() => {
            alert("Teacher Added!");
            teacherForm.reset();
        });
    });
}

if(teacherTableBody) {
    database.ref('teachers/').on('value', (snapshot) => {
        teacherTableBody.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const t = childSnapshot.val();
            teacherTableBody.innerHTML += `
                <tr>
                    <td>${t.name}</td>
                    <td>${t.designation}</td>
                    <td>${t.subject}</td>
                    <td><button onclick="deleteTeacher('${childSnapshot.key}')" style="color:red;">Delete</button></td>
                </tr>`;
        });
    });
}

window.deleteTeacher = (id) => {
    if(confirm("Remove teacher?")) database.ref('teachers/' + id).remove();
}
