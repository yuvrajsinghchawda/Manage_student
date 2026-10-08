import { useState } from "react";
import "./App.css";

const emptyStudent = {
  name: "",
  studentId: "",
  branch: "",
  semester: "",
  marks: {},
  certificates: "",
  skills: [],
  projects: "",
  pendingWork: "",
  careerGoal: "Software Developer",
  collegeTime: "",
  sleepTime: "",
  dailyTime: ""
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [isRegistering, setIsRegistering] = useState(false);

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    studentId: "",
    branch: "",
    semester: ""
  });

  const [student, setStudent] = useState(emptyStudent);
  const [selectedSkillPopup, setSelectedSkillPopup] = useState(null);

  const [currentEmail, setCurrentEmail] = useState("");

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const skillOptions = [
  "Python",
  "JavaScript",
  "HTML/CSS",
  "SQL",
  "Java",
  "C/C++",
  "React",
  "Node.js",
  "Git",
  "Statistics",
  "Linear Algebra",
  "Machine Learning",
  "Cloud Basics",
  "Excel/Tableau",
  "Linux"
];

  // =========================
  // GET USERS FROM LOCAL STORAGE
  // =========================

  const getUsers = () => {
    return JSON.parse(localStorage.getItem("eduAI_users")) || {};
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = (e) => {
    e.preventDefault();

    const {
      email,
      password,
      confirmPassword,
      name,
      studentId,
      branch,
      semester
    } = registerData;

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !name ||
      !studentId ||
      !branch ||
      !semester
    ) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = getUsers();

    if (users[email]) {
      alert("Account already exists with this email");
      return;
    }

    const newStudent = {
      ...emptyStudent,

      name,
      studentId,
      branch,
      semester
    };

    users[email] = {
      password,
      student: newStudent
    };

    localStorage.setItem(
      "eduAI_users",
      JSON.stringify(users)
    );

    alert("Account created successfully! Please login.");

    setRegisterData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      studentId: "",
      branch: "",
      semester: ""
    });

    setIsRegistering(false);
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      alert("Please enter email and password");
      return;
    }

    const users = getUsers();

    const user = users[loginData.email];

    if (!user) {
      alert("Account not found. Please create an account first.");
      return;
    }

    if (user.password !== loginData.password) {
      alert("Incorrect password");
      return;
    }

    setStudent(user.student);
    setCurrentEmail(loginData.email);
    setIsLoggedIn(true);
    setAiAnalysis(null);
  };

  // =========================
  // UPDATE STUDENT DATA
  // =========================

  const updateStudent = (field, value) => {
    const updatedStudent = {
      ...student,
      [field]: value
    };

    setStudent(updatedStudent);

    saveStudentData(updatedStudent);
  };

  // =========================
  // UPDATE MARKS
  // =========================

  const updateMarks = (subject, value) => {
  const updatedStudent = {
    ...student,
    marks: {
      ...student.marks,
      [subject]: value
    }
  };

  setStudent(updatedStudent);
  saveStudentData(updatedStudent);
};

  // =========================
  // SAVE STUDENT DATA
  // =========================

  const saveStudentData = (updatedStudent) => {
    if (!currentEmail) return;

    const users = getUsers();

    if (users[currentEmail]) {
      users[currentEmail].student = updatedStudent;

      localStorage.setItem(
        "eduAI_users",
        JSON.stringify(users)
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    setIsLoggedIn(false);

    setStudent(emptyStudent);

    setCurrentEmail("");

    setLoginData({
      email: "",
      password: ""
    });

    setAiAnalysis(null);
  };

  // =========================
  // GEMINI AI ANALYSIS
  // =========================

  const handleAIAnalysis = async () => {
    try {
      setLoadingAI(true);
      setAiAnalysis(null);

      console.log("Sending student data to backend...");

      const response = await fetch(
        "http://localhost:5000/api/ai/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(student)
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      if (data.success) {
        setAiAnalysis(data.analysis);
      } else {
        alert("AI analysis failed");
      }

    } catch (error) {
      console.error("Frontend AI Error:", error);

      alert(
        "Could not connect to backend. Make sure backend server is running."
      );

    } finally {
      setLoadingAI(false);
    }
  };

  // =========================
  // REGISTER SCREEN
  // =========================

  if (!isLoggedIn && isRegistering) {
    return (
      <div className="app">

        <div className="login-container">

          <div className="login-card">

            <div className="logo">
              🎓
            </div>

            <h1>Create Account</h1>

            <p className="subtitle">
              Create your EduAI student profile
            </p>

            <form onSubmit={handleRegister}>

              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    name: e.target.value
                  })
                }
              />

              <label>Student ID</label>

              <input
                type="text"
                placeholder="Example: AITR001"
                value={registerData.studentId}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    studentId: e.target.value
                  })
                }
              />
<label>Branch</label>

<select
  value={registerData.branch}
  onChange={(e) =>
    setRegisterData({
      ...registerData,
      branch: e.target.value
    })
  }
>
  <option value="">Select Branch</option>

  <option value="Computer Science & Engineering">
    Computer Science & Engineering
  </option>

  <option value="CSE - AIML">
    CSE - AIML
  </option>

  <option value="CSE - Cyber Security">
    CSE - Cyber Security
  </option>

  <option value="CSE - Data Science">
    CSE - Data Science
  </option>

  <option value="Mechanical Engineering">
    Mechanical Engineering
  </option>

  <option value="Civil Engineering">
    Civil Engineering
  </option>

  <option value="Electrical Engineering">
    Electrical Engineering
  </option>

  <option value="Electronics & Communication Engineering">
    Electronics & Communication Engineering
  </option>
</select>

  <label>Semester</label>

<select
  value={registerData.semester}
  onChange={(e) =>
    setRegisterData({
      ...registerData,
      semester: e.target.value
    })
  }
>
  <option value="">Select Semester</option>

  <option value="1st Semester">1st Semester</option>
  <option value="2nd Semester">2nd Semester</option>
  <option value="3rd Semester">3rd Semester</option>
  <option value="4th Semester">4th Semester</option>
  <option value="5th Semester">5th Semester</option>
  <option value="6th Semester">6th Semester</option>
  <option value="7th Semester">7th Semester</option>
  <option value="8th Semester">8th Semester</option>
</select>

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter student email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    email: e.target.value
                  })
                }
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Create password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value
                  })
                }
              />

              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value
                  })
                }
              />

              <button
                className="primary-btn"
                type="submit"
              >
                Create Account →
              </button>

            </form>

            <p className="login-note">
              Already have an account?
            </p>

            <button
              className="logout-btn"
              onClick={() => setIsRegistering(false)}
            >
              Back to Login
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!isLoggedIn) {
    return (
      <div className="app">

        <div className="login-container">

          <div className="login-card">

            <div className="logo">
              🎓
            </div>

            <h1>EduAI</h1>

            <p className="subtitle">
              AI Student Growth Planner
            </p>

            <form onSubmit={handleLogin}>

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter student email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value
                  })
                }
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value
                  })
                }
              />

              <button
                className="primary-btn"
                type="submit"
              >
                Sign In →
              </button>

            </form>

            <p className="login-note">
              Don't have an account?
            </p>

            <button
              className="logout-btn"
              onClick={() => setIsRegistering(true)}
            >
              Create New Account
            </button>

            <p className="login-note">
              Personalized academic & career planning with AI
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="brand">
          🎓 EduAI
        </div>

        <div className="nav-right">

          <span>
            {student.name || currentEmail}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= DASHBOARD ================= */}

      <main className="dashboard">

        {/* HEADER */}

        <div className="welcome">

          <div>

            <p className="small-text">
              STUDENT DASHBOARD
            </p>

            <h1>
              Welcome,{" "}
              {student.name
                ? student.name.split(" ")[0]
                : "Student"} 👋
            </h1>

            <p>
              Let's understand where you are and plan what comes next.
            </p>

          </div>

          <div className="student-badge">

            <strong>
              {student.studentId || "Student ID"}
            </strong>

            <span>
              {student.semester || "Semester"}
            </span>

          </div>

        </div>


        {/* ================= QUICK OVERVIEW ================= */}

        <div className="overview-grid">

          <div className="overview-card">

            <span>📊</span>

            <div>
              <h3>Academic</h3>
              <p>Marks & Performance</p>
            </div>

          </div>


          <div className="overview-card">

            <span>📜</span>

            <div>
              <h3>Certificates</h3>
              <p>Skills & Achievements</p>
            </div>

          </div>


          <div className="overview-card">

            <span>📝</span>

            <div>
              <h3>Pending Work</h3>
              <p>Tasks to complete</p>
            </div>

          </div>


          <div className="overview-card">

            <span>🎯</span>

            <div>
              <h3>Career Goal</h3>
              <p>{student.careerGoal}</p>
            </div>

          </div>

        </div>


        {/* ================= STUDENT PROFILE ================= */}

        <section className="section">

          <div className="section-heading">

            <div>

              <p className="small-text">
                STUDENT PROFILE
              </p>

              <h2>
                Your Profile
              </h2>

              <p>
                Update your academics, skills and goals.
              </p>

            </div>

          </div>


          {/* ================= BASIC INFORMATION ================= */}

          <div className="card">

            <h3>👤 Basic Information</h3>

            <div className="form-grid">

              <div>

                <label>Name</label>

                <input
                  value={student.name}
                  onChange={(e) =>
                    updateStudent(
                      "name",
                      e.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>Student ID</label>

                <input
                  value={student.studentId}
                  onChange={(e) =>
                    updateStudent(
                      "studentId",
                      e.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>Branch</label>

                <input
                  value={student.branch}
                  onChange={(e) =>
                    updateStudent(
                      "branch",
                      e.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>Semester</label>

                <input
                  value={student.semester}
                  onChange={(e) =>
                    updateStudent(
                      "semester",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>

{/* ================= MARKS ================= */}

<div className="card">

  <div className="card-header">

    <div>
      <h3>📊 Academic Performance</h3>

      <p>
        Add your subjects and latest marks.
      </p>
    </div>

  </div>

  <div className="marks-grid">

   {Object.entries(student.marks).map(
  ([subject, mark], index) => (

        <div
      className="mark-box"
       key={index}
>

          <label>Subject</label>

          <input
            type="text"
            value={subject}
            onChange={(e) => {

              const newSubject = e.target.value;

              const updatedMarks = {};

              Object.entries(student.marks).forEach(
                ([oldSubject, oldMark]) => {

                  if (oldSubject === subject) {
                    updatedMarks[newSubject] = oldMark;
                  } else {
                    updatedMarks[oldSubject] = oldMark;
                  }

                }
              );

              setStudent({
                ...student,
                marks: updatedMarks
              });

            }}
            onBlur={() => {
              saveStudentData(student);
            }}
          />

          <label>Marks</label>

          <div className="mark-input">

            <input
              type="number"
              min="0"
              max="100"
              value={mark}
              onChange={(e) =>
                updateMarks(
                  subject,
                  e.target.value
                )
              }
            />

            <span>%</span>

          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={() => {

              const updatedMarks = {
                ...student.marks
              };

              delete updatedMarks[subject];

              const updatedStudent = {
                ...student,
                marks: updatedMarks
              };

              setStudent(updatedStudent);
              saveStudentData(updatedStudent);

            }}
          >
            Remove
          </button>

        </div>

      )
    )}

  </div>

  <button
    type="button"
    className="primary-btn"
    onClick={() => {

      const subjectName =
        `Subject ${Object.keys(student.marks).length + 1}`;

      const updatedStudent = {
        ...student,
        marks: {
          ...student.marks,
          [subjectName]: ""
        }
      };

      setStudent(updatedStudent);
      saveStudentData(updatedStudent);

    }}
  >
    + Add Subject
  </button>

</div>


          {/* ================= CERTIFICATES ================= */}

          <div className="card">

            <h3>
              📜 Certificates
            </h3>

            <p>
              Add certificates or courses you have completed.
            </p>

            <textarea
              value={student.certificates}
              onChange={(e) =>
                updateStudent(
                  "certificates",
                  e.target.value
                )
              }
              placeholder="Example: C++ Programming Certificate"
            />

          </div>


          {/* ================= SKILLS ================= */}
<div className="form-group">
  <label>Skills you have</label>

  <div className="skills-selection">
    {skillOptions.map((skill) => {
      const isSelected = student.skills?.includes(skill);

      return (
        <button
          type="button"
          key={skill}
          className={`skill-option ${
            isSelected ? "selected" : ""
          }`}
          onClick={() => {
            let updatedSkills;

            if (isSelected) {
              updatedSkills = student.skills.filter(
                (item) => item !== skill
              );
            } else {
              updatedSkills = [
                ...student.skills,
                skill
              ];

              // Popup show hoga
              setSelectedSkillPopup(skill);
            }

            updateStudent("skills", updatedSkills);
          }}
        >
          <span className="skill-check">
            {isSelected ? "✓" : "+"}
          </span>

          {skill}
        </button>
      );
    })}
  </div>

  <p className="skills-hint">
    Select all skills you currently have.
  </p>
</div>

          {/* ================= PROJECTS ================= */}

          <div className="card">

            <h3>
              🚀 Projects
            </h3>

            <textarea
              value={student.projects}
              onChange={(e) =>
                updateStudent(
                  "projects",
                  e.target.value
                )
              }
              placeholder="Mention your projects"
            />

          </div>


          {/* ================= PENDING WORK ================= */}

          <div className="card">

            <h3>
              📝 Pending Academic Work
            </h3>

            <p>
              What academic tasks are still incomplete?
            </p>

            <textarea
              value={student.pendingWork}
              onChange={(e) =>
                updateStudent(
                  "pendingWork",
                  e.target.value
                )
              }
              placeholder="Example: DSA Assignment, DBMS Project"
            />

          </div>


          {/* ================= CAREER GOAL ================= */}

          <div className="card">

            <h3>
              🎯 Career Goal
            </h3>

            <p>
              What do you want to become?
            </p>

            <select
              value={student.careerGoal}
              onChange={(e) =>
                updateStudent(
                  "careerGoal",
                  e.target.value
                )
              }
            >

              <option>
                Software Developer
              </option>

              <option>
                Web Developer
              </option>

              <option>
                Data Analyst
              </option>

              <option>
                AI / ML Engineer
              </option>

              <option>
                Cybersecurity Engineer
              </option>

              <option>
                Higher Studies
              </option>

            </select>

          </div>


          {/* ================= DAILY SCHEDULE ================= */}

          <div className="card">

            <h3>
              ⏰ Daily Schedule
            </h3>

            <div className="form-grid">

              <div>

                <label>
                  College Timing
                </label>

                <input
                  value={student.collegeTime}
                  onChange={(e) =>
                    updateStudent(
                      "collegeTime",
                      e.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>
                  Sleep Timing
                </label>

                <input
                  value={student.sleepTime}
                  onChange={(e) =>
                    updateStudent(
                      "sleepTime",
                      e.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>
                  Available Study Time
                </label>

                <input
                  value={student.dailyTime}
                  onChange={(e) =>
                    updateStudent(
                      "dailyTime",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>


          {/* ================= ANALYZE BUTTON ================= */}

          <div className="analyze-section">

            <p>
              Ready to understand your academic and career journey?
            </p>

            <button
              className="analyze-btn"
              onClick={handleAIAnalysis}
              disabled={loadingAI}
            >

              {loadingAI
                ? "✨ Analyzing..."
                : "✨ Analyze My Profile"}

            </button>

          </div>


          {/* ================= AI RESULT ================= */}
{aiAnalysis && (
  <div className="ai-dashboard">

    {/* HEADER */}
    <div className="ai-header">
      <div>
        <p className="ai-label">✨ GEMINI AI INSIGHTS</p>
        <h2>AI Academic & Career Analysis</h2>
        <p>
          Personalized analysis based on your academic performance,
          skills, pending work and career goal.
        </p>
      </div>
<div
  className="progress-circle"
  style={{
    "--progress": aiAnalysis.overallProgress || 0
  }}
>
        <div className="progress-inner">
          <strong>{aiAnalysis.overallProgress || 0}%</strong>
          <span>Progress</span>
        </div>
      </div>
    </div>


    {/* SUMMARY */}
    <div className="ai-summary-card">
      <div className="section-icon">🧠</div>

      <div>
        <h3>Overall Analysis</h3>
        <p>{aiAnalysis.summary}</p>
      </div>
    </div>


    {/* STRENGTHS + WEAK AREAS */}
    <div className="ai-two-column">

      <div className="insight-card strength-card">
        <div className="insight-title">
          <span>💪</span>
          <h3>Your Strengths</h3>
        </div>

        <div className="tag-list">
          {aiAnalysis.strengths?.map((item, index) => (
            <div className="insight-item" key={index}>
              ✓ {item}
            </div>
          ))}
        </div>
      </div>


      <div className="insight-card weakness-card">
        <div className="insight-title">
          <span>⚠️</span>
          <h3>Needs Improvement</h3>
        </div>

        <div className="tag-list">
          {aiAnalysis.weakAreas?.map((item, index) => (
            <div className="insight-item" key={index}>
              ! {item}
            </div>
          ))}
        </div>
      </div>

    </div>


    {/* SUBJECT PERFORMANCE */}
    <div className="ai-card">

      <div className="ai-card-heading">
        <div>
          <h3>📊 Subject Performance</h3>
          <p>Your current academic performance</p>
        </div>
      </div>

      <div className="subject-chart">

        {Object.entries(student.marks || {}).map(
          ([subject, mark], index) => {

            const percentage = Number(mark) || 0;

            return (
              <div className="subject-row" key={index}>

                <div className="subject-name">
                  <span>{subject || "Unnamed Subject"}</span>
                  <strong>{percentage}%</strong>
                </div>

                <div className="bar-background">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.min(percentage, 100)}%`
                    }}
                  ></div>
                </div>

              </div>
            );
          }
        )}

      </div>

    </div>


    {/* SKILL GAPS */}
    <div className="ai-card">

      <div className="ai-card-heading">
        <div>
          <h3>🚀 Skill Gaps</h3>
          <p>Skills you should focus on next</p>
        </div>
      </div>

      <div className="skill-grid">

        {aiAnalysis.skillGaps?.map((skill, index) => (
          <div className="skill-card" key={index}>
            <span>🎯</span>
            <p>{skill}</p>
          </div>
        ))}

      </div>

    </div>


    {/* PRIORITY TASKS */}
    <div className="ai-card">

      <div className="ai-card-heading">
        <div>
          <h3>📋 Priority Tasks</h3>
          <p>What you should work on first</p>
        </div>
      </div>

      <div className="priority-list">

        {aiAnalysis.priorityTasks?.map((item, index) => (

          <div className="priority-item" key={index}>

            <div className="priority-number">
              {index + 1}
            </div>

            <div className="priority-content">
              <div className="priority-top">
                <h4>{item.task}</h4>

                <span
                  className={
                    item.priority === "High"
                      ? "priority-high"
                      : "priority-medium"
                  }
                >
                  {item.priority}
                </span>
              </div>

              <p>{item.reason}</p>
            </div>

          </div>

        ))}

      </div>

    </div>


    {/* DAILY ROUTINE */}
    <div className="ai-card routine-card">

      <div className="ai-card-heading">
        <div>
          <h3>⏰ Your AI Daily Routine</h3>
          <p>
            Personalized according to your available study time.
          </p>
        </div>

        <div className="routine-badge">
          🤖 AI Planned
        </div>
      </div>

      <div className="routine-timeline">

        {aiAnalysis.routine?.map((item, index) => (

          <div className="routine-item" key={index}>

            <div className="routine-time">
              {item.time}
            </div>

            <div className="timeline-line">
              <div className="timeline-dot"></div>
            </div>

            <div className="routine-content">
              <h4>{item.activity}</h4>
              <span>{item.type}</span>
            </div>

          </div>

        ))}

      </div>

    </div>


    {/* DAILY GOALS */}
    <div className="ai-card goals-card">

      <div className="ai-card-heading">
        <div>
          <h3>🎯 Today's Goals</h3>
          <p>Small tasks that move you toward your career goal.</p>
        </div>
      </div>

      <div className="goal-list">

        {aiAnalysis.dailyGoals?.map((goal, index) => (

          <div className="goal-item" key={index}>

            <div className="goal-check">
              ✓
            </div>

            <span>{goal}</span>

          </div>

        ))}

      </div>

    </div>


    {/* IMPROVEMENTS */}
    <div className="ai-card">

      <div className="ai-card-heading">
        <div>
          <h3>💡 Recommended Improvements</h3>
          <p>Actions suggested by Gemini AI</p>
        </div>
      </div>

      <div className="improvement-list">

        {aiAnalysis.improvements?.map((item, index) => (

          <div className="improvement-item" key={index}>

            <span>{index + 1}</span>

            <p>{item}</p>

          </div>

        ))}

      </div>

    </div>


    {/* CAREER ADVICE */}
    <div className="career-advice">

      <div className="career-icon">
        🚀
      </div>

      <div className="career-advice">
  <div className="career-glow"></div>

  <div className="career-icon-box">
    🚀
  </div>

  <div className="career-content">
    <div className="career-label">
      ✨ AI CAREER GUIDANCE
    </div>

    <h3>Your Recommended Next Step</h3>

    <p className="career-description">
      Based on your current skills and certificates,
      Gemini AI recommends the following direction for you:
    </p>

    <div className="career-recommendation">
      <span className="recommendation-icon">🎯</span>

      <div>
        <span className="recommendation-label">
          AI RECOMMENDATION
        </span>

        <p>{aiAnalysis.careerAdvice}</p>
      </div>
    </div>

    <div className="career-footer">
      <span>🤖 Powered by Gemini AI</span>
      <span>•</span>
      <span>Personalized for you</span>
    </div>
  </div>
</div>
    </div>
   </div>
)}
  </section>
 </main>
 </div>
  );
}
export default App;