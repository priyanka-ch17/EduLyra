import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Download,
  Filter,
  Search,
  Sparkles,
  UserRound,
  BookOpen,
  Award,
  BriefcaseBusiness,
  Bell,
  FileText,
  PlayCircle,
  Clock3,
  CheckCircle2,
  Code2,
  Database,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  getMyData,
  getOpportunities,
  applyToOpportunity,
  saveAssessment,
  completeLearning,
  markNotification,
  updateProfile,
  enrollLearning,
  updateLearningProgress,
  recordVideoCompletion,
  saveOpportunity,
  removeSavedOpportunity,
  getMessagesForUser,
  allUsers,
  markAllNotifications,
} from "../services/store";
import { OpportunityCard } from '../components/OpportunityCard';
import { subjectForSkill, LEARNING_SUBJECTS } from '../services/learningCatalog';
import { MatchScore } from '../components/MatchScore';
import { ProgressBar } from '../components/ProgressBar';
import type { Opportunity } from '../types';


function Title({title,subtitle}:{title:string;subtitle:string}){return <div><h1 className="text-2xl font-black">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>}
const alias=(q:string)=>{const x=q.toLowerCase().trim(); return x==='js'?'javascript':x==='react js'?'react':x==='node'?'node.js':x};
function SearchBox({value,onChange}:{value:string;onChange:(x:string)=>void}){const suggestions=['Java','JavaScript','Java Developer Jobs','Java Internship','Java Certification','Java Courses']; const show=value.toLowerCase().startsWith('java');return <div className="relative"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input className="input pl-9" value={value} onChange={e=>onChange(e.target.value)} placeholder="Search jobs, internships, courses, skills…"/>{show&&<div className="absolute z-20 mt-1 w-full rounded-xl border bg-white p-2 shadow-xl">{suggestions.map(s=><button key={s} onClick={()=>onChange(s)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">{s}</button>)}</div>}</div>}
export function Opportunities(){
 const u:any=getMyData(); const skills:string[]=u?.profile?.currentSkills||[]; const gaps:string[]=u?.assessment?.gaps||[]; const target=String(u?.profile?.desiredJobRole||u?.profile?.careerGoal||'').toLowerCase(); const [q,setQ]=useState(''); const [type,setType]=useState('All'); const ops=getOpportunities();
 const relevance=(o:Opportunity)=>{const text=`${o.title} ${o.company} ${o.skills.join(' ')} ${o.description}`.toLowerCase();const skillHits=o.skills.filter(x=>skills.some(s=>s.toLowerCase()===x.toLowerCase())).length;const gapHits=o.skills.filter(x=>gaps.some(g=>g.toLowerCase()===x.toLowerCase())).length;const targetWords=target.split(/\s+/).filter(x=>x.length>2);const targetHit=targetWords.filter(w=>text.includes(w)).length*7;return Math.min(99,45+skillHits*10+gapHits*8+targetHit)};
 const f=useMemo(()=>{const query=alias(q).toLowerCase().trim();return ops.filter(o=>(type==='All'||o.type===type)&&(!query||`${o.title} ${o.company} ${o.skills.join(' ')} ${o.description} ${o.location}`.toLowerCase().includes(query))).map(o=>({...o,match:relevance(o)})).sort((a,b)=>b.match-a.match)},[q,type,ops,u]);
 const resources=[...skills,...gaps,'Java','Python','Web Development','DBMS','SQL','Figma','React'];const resourceHits=q.trim()?Array.from(new Set(resources.filter(x=>x.toLowerCase().includes(q.toLowerCase())).slice(0,8))):[];
 return <div className="space-y-6"><Title title="Opportunities" subtitle="Search across jobs, internships, training, projects, courses, certifications and skills. Results are ranked using your career goal and profile."/><div className="card p-4"><div className="grid gap-3 md:grid-cols-[1fr_180px_130px]"><SearchBox value={q} onChange={setQ}/><select className="input" value={type} onChange={e=>setType(e.target.value)}><option>All</option><option>Internship</option><option>Job</option><option>Training</option><option>Faculty</option><option>Project</option><option>Apprenticeship</option><option>Certification</option><option>Workshop</option></select><button className="btn-secondary" onClick={()=>{setQ('');setType('All')}}><Filter size={15}/> Clear</button></div></div>{resourceHits.length>0&&<div className="card p-5"><h2 className="font-bold">Matching skills & learning topics</h2><div className="mt-3 flex flex-wrap gap-2">{resourceHits.map(x=><span className="badge bg-violet-50 text-violet-700" key={x}>{x}</span>)}</div><p className="mt-3 text-xs text-slate-500">Open Learning or Career Advisor for the corresponding resources and recommendations.</p></div>}<p className="text-sm text-slate-500">{f.length} opportunity results · ranked by career alignment.</p><div className="grid gap-4 lg:grid-cols-2">{f.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}</div>{!f.length&&<div className="card p-8 text-center text-sm text-slate-500">No relevant opportunities found. Try a broader keyword or update your Career Goal.</div>}</div>}

const technicalByRole:Record<string,string[]>= {'Software Developer':['JavaScript','HTML','CSS','DOM','APIs','Programming fundamentals'],'JavaScript':['JavaScript','HTML','CSS','DOM','APIs'],'Python Developer':['Python','Functions','OOP','Pandas','APIs'],'Data Analyst':['Python','SQL','Statistics','Excel','Data analysis','Visualization'],'Cloud Engineer':['AWS','Linux','Networking','Docker']};
// =====================================================
// ASSESSMENT SESSION HELPERS
// =====================================================

type AssessmentSession = {
  attemptId: string;
  studentId: string;
  startedAt: string;
  deadlineAt: string;
  submittedAt?: string;
  status: 'active' | 'expired' | 'submitted';
  autoSubmitted?: boolean;
};

const ASSESSMENT_SESSION_KEY = 'edulyra_assessment_session';

const ASSESSMENT_DURATION_SECONDS = 15 * 60;

// Get the current assessment session
function getAssessmentSession(): AssessmentSession | null {
  try {
    const savedSession = localStorage.getItem(
      ASSESSMENT_SESSION_KEY
    );

    if (!savedSession) {
      return null;
    }

    return JSON.parse(savedSession) as AssessmentSession;
  } catch {
    return null;
  }
}

// Start a new assessment
function startAssessment(
  studentId: string
): AssessmentSession {
  const now = new Date();

  const deadline = new Date(
    now.getTime() +
      ASSESSMENT_DURATION_SECONDS * 1000
  );

  const session: AssessmentSession = {
    attemptId: `attempt_${Date.now()}`,
    studentId,
    startedAt: now.toISOString(),
    deadlineAt: deadline.toISOString(),
    status: 'active',
    autoSubmitted: false,
  };

  localStorage.setItem(
    ASSESSMENT_SESSION_KEY,
    JSON.stringify(session)
  );

  localStorage.setItem(
    'edulyra_assessment_started_at',
    session.startedAt
  );

  recordAssessmentEvent('STARTED');

  return session;
}

// Calculate remaining time from the saved deadline
function getRemainingTime(
  session: AssessmentSession
): number {
  const deadline = new Date(
    session.deadlineAt
  ).getTime();

  const currentTime = Date.now();

  return Math.max(
    0,
    Math.floor((deadline - currentTime) / 1000)
  );
}

// Record assessment events
function recordAssessmentEvent(
  eventType: string
): void {
  try {
    const eventCount = Number(
      localStorage.getItem(
        'edulyra_assessment_event_count'
      ) || '0'
    );

    localStorage.setItem(
      'edulyra_assessment_event_count',
      String(eventCount + 1)
    );

    localStorage.setItem(
      'edulyra_assessment_last_event',
      JSON.stringify({
        type: eventType,
        timestamp: new Date().toISOString(),
      })
    );
  } catch {
    console.warn(
      'Unable to record assessment event.'
    );
  }
}

// Mark the assessment as expired
function markAssessmentExpired(): void {
  const session = getAssessmentSession();

  if (!session || session.status !== 'active') {
    return;
  }

  const expiredSession: AssessmentSession = {
    ...session,
    status: 'expired',
    submittedAt: new Date().toISOString(),
    autoSubmitted: true,
  };

  localStorage.setItem(
    ASSESSMENT_SESSION_KEY,
    JSON.stringify(expiredSession)
  );

  recordAssessmentEvent('AUTO_SUBMITTED');
}
export function Assessment() {
  const u: any = getMyData();
  const careerGoal = String(
    u?.profile?.careerGoal ||
      u?.profile?.desiredJobRole ||
      'Software Developer'
  ).trim();

  const questionStorageKey = `edulyra_assessment_questions_${careerGoal
    .toLowerCase()
    .replace(/\s+/g, '_')}`;
  const answerStorageKey = `edulyra_assessment_answers_${careerGoal
    .toLowerCase()
    .replace(/\s+/g, '_')}`;

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(answerStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const answersRef = useRef<Record<string, string>>(answers);
  const submittingRef = useRef(false);

  const [submitted, setSubmitted] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentLocked, setAssessmentLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const bank = useMemo(
    () => getAssessmentQuestions(careerGoal),
    [careerGoal]
  );

  const createQuestionSet = (): AssessmentQuestion[] => {
    const byCategory = (
      category: AssessmentQuestion['category'],
      count: number
    ) =>
      shuffle(
        bank
          .filter((question) => question.category === category)
          .map((question) => ({
            ...question,
            options: shuffle([...question.options]),
          }))
      ).slice(0, count);

    return shuffle([
      ...byCategory(
        'Technical',
        Math.min(
          5,
          bank.filter((question) => question.category === 'Technical').length
        )
      ),
      ...byCategory(
        'Soft Skills',
        Math.min(
          3,
          bank.filter((question) => question.category === 'Soft Skills').length
        )
      ),
      ...byCategory(
        'Aptitude',
        Math.min(
          3,
          bank.filter((question) => question.category === 'Aptitude').length
        )
      ),
    ]);
  };

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  const answered = Object.keys(answers).filter(
    (questionId) => answers[questionId] !== undefined
  ).length;

  useEffect(() => {
    answersRef.current = answers;
    localStorage.setItem(answerStorageKey, JSON.stringify(answers));
  }, [answers, answerStorageKey]);

  const handleStartAssessment = async () => {
    if (assessmentStarted) return;

    const studentId = String(u?.id || 'unknown');
    const generatedQuestions = createQuestionSet();

    setQuestions(generatedQuestions);
    setAnswers({});
    answersRef.current = {};
    setSubmitted(false);
    setAutoSubmitted(false);
    setAssessmentLocked(false);
    setWarningMessage('');
    setTimeLeft(ASSESSMENT_DURATION_SECONDS);

    localStorage.setItem(
      questionStorageKey,
      JSON.stringify(generatedQuestions)
    );
    localStorage.setItem(answerStorageKey, JSON.stringify({}));

    startAssessment(studentId);
    setAssessmentStarted(true);

    try {
      await document.documentElement.requestFullscreen();
      recordAssessmentEvent('FULLSCREEN_ENTERED');
    } catch {
      setWarningMessage(
        'Fullscreen permission was not granted. The assessment can still continue.'
      );
    }
  };

  const submitAssessment = (isAutoSubmit = false) => {
    if (submittingRef.current || submitted) return;

    if (!questions.length) {
      setWarningMessage('No assessment questions are available.');
      return;
    }

    const currentAnswers = answersRef.current;
    const answeredCount = Object.keys(currentAnswers).filter(
      (questionId) => currentAnswers[questionId] !== undefined
    ).length;

    if (!isAutoSubmit && answeredCount !== questions.length) {
      setWarningMessage('Please answer every question before submitting.');
      return;
    }

    submittingRef.current = true;

    const correct = questions.filter(
      (question) => currentAnswers[question.id] === question.answer
    ).length;

    const domain: Record<string, number[]> = {};

    questions.forEach((question) => {
      if (!domain[question.domain]) domain[question.domain] = [];
      domain[question.domain].push(
        currentAnswers[question.id] === question.answer ? 100 : 0
      );
    });

    const domainScores = Object.fromEntries(
      Object.entries(domain).map(([key, values]) => [
        key,
        Math.round(
          values.reduce((sum, value) => sum + value, 0) / values.length
        ),
      ])
    );

    const calculateScore = (category: AssessmentQuestion['category']) => {
      const categoryQuestions = questions.filter(
        (question) => question.category === category
      );

      if (!categoryQuestions.length) return 0;

      return Math.round(
        (categoryQuestions.filter(
          (question) => currentAnswers[question.id] === question.answer
        ).length /
          categoryQuestions.length) *
          100
      );
    };

    const overall = Math.round((correct / questions.length) * 100);
    const sortedDomains = Object.entries(domainScores).sort(
      (a, b) => a[1] - b[1]
    );

    const gaps = sortedDomains
      .filter((entry) => entry[1] < 70)
      .slice(0, 3)
      .map((entry) => entry[0]);

    const strengths = Object.entries(domainScores)
      .filter((entry) => entry[1] >= 70)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map((entry) => entry[0]);

    const session = getAssessmentSession();
    const startedAt =
      session?.startedAt ||
      localStorage.getItem('edulyra_assessment_started_at') ||
      undefined;

    saveAssessment({
      overall,
      technical: calculateScore('Technical'),
      soft: calculateScore('Soft Skills'),
      aptitude: calculateScore('Aptitude'),
      communication: calculateScore('Soft Skills'),
      problemSolving: calculateScore('Aptitude'),
      strengths,
      gaps,
      recommendations: gaps.map(
        (gap) =>
          `Build ${gap} through targeted learning, practice and a verified project.`
      ),
      completedAt: new Date().toISOString(),
      domainScores,
      careerGoal,
      answeredCount,
      antiCheatEvents: Number(
        localStorage.getItem('edulyra_assessment_event_count') || 0
      ),
      questionIds: questions.map((question) => question.id),
      startedAt,
      autoSubmitted: isAutoSubmit,
    });

    recordAssessmentEvent(
      isAutoSubmit ? 'AUTO_SUBMITTED' : 'MANUALLY_SUBMITTED'
    );

    const sessionAfterSubmit = getAssessmentSession();
    if (sessionAfterSubmit) {
      localStorage.setItem(
        ASSESSMENT_SESSION_KEY,
        JSON.stringify({
          ...sessionAfterSubmit,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          autoSubmitted: isAutoSubmit,
        })
      );
    }

    localStorage.removeItem('edulyra_assessment_started_at');
    localStorage.removeItem('edulyra_assessment_event_count');
    localStorage.removeItem(answerStorageKey);
    localStorage.removeItem(questionStorageKey);

    setAutoSubmitted(isAutoSubmit);
    setSubmitted(true);
    setAssessmentStarted(false);
    setAssessmentLocked(false);
    submittingRef.current = false;
  };

  useEffect(() => {
    if (!assessmentStarted || submitted) return;

    const updateTimer = () => {
      try {
        const rawSession = localStorage.getItem(ASSESSMENT_SESSION_KEY);

        if (!rawSession) {
          setTimeLeft(0);
          return;
        }

        const session = JSON.parse(rawSession) as AssessmentSession;
        const deadline = new Date(session.deadlineAt).getTime();

        if (!Number.isFinite(deadline)) {
          console.error('Invalid assessment deadline:', session);
          return;
        }

        const remaining = Math.max(
          0,
          Math.ceil((deadline - Date.now()) / 1000)
        );

        setTimeLeft(remaining);

        if (remaining <= 0) {
          markAssessmentExpired();
          submitAssessment(true);
        }
      } catch (error) {
        console.error('Timer error:', error);
      }
    };

    updateTimer();
    const timerId = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(timerId);
  }, [assessmentStarted, submitted]);

  useEffect(() => {
    if (!assessmentStarted || submitted) return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        recordAssessmentEvent('TAB_SWITCH');
        setAssessmentLocked(true);
        setWarningMessage(
          'Tab switching was detected. Your assessment is locked until you continue.'
        );
      }
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        recordAssessmentEvent('FULLSCREEN_EXIT');
        setAssessmentLocked(true);
        setWarningMessage(
          'Fullscreen mode was exited. Your assessment is locked until you continue.'
        );
      }
    };

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        'Your assessment is in progress. Are you sure you want to leave?';
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [assessmentStarted, submitted]);

  const continueAssessment = async () => {
    setAssessmentLocked(false);
    setWarningMessage('');

    try {
      await document.documentElement.requestFullscreen();
      recordAssessmentEvent('FULLSCREEN_ENTERED');
    } catch {
      setWarningMessage(
        'Fullscreen permission was not granted. Continue carefully.'
      );
    }
  };

  const safeTimeLeft = Number.isFinite(timeLeft)
    ? Math.max(0, timeLeft)
    : 0;
  const mins = String(Math.floor(safeTimeLeft / 60)).padStart(2, '0');
  const secs = String(safeTimeLeft % 60).padStart(2, '0');

  if (submitted) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Title
          title="Assessment Results"
          subtitle={`Your ${careerGoal} assessment has been scored and saved to your skill profile.`}
        />

        {autoSubmitted && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Your assessment was automatically submitted because the time limit expired.
          </div>
        )}

        <AssessmentResults />
      </div>
    );
  }

  if (!assessmentStarted) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Title
          title="Personalized Skill Assessment"
          subtitle={`Assessment based on your career goal: ${careerGoal}`}
        />

        <div className="card p-8 text-center">
          <h2 className="text-2xl font-black">Ready to start your assessment?</h2>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            You will have 15 minutes to complete the assessment. Fullscreen mode
            will be requested after starting.
          </p>

          <div className="mt-5 rounded-xl bg-amber-50 p-4 text-left text-xs leading-5 text-amber-800">
            <b>Exam mode:</b>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Switching tabs may be recorded.</li>
              <li>Fullscreen exit may be recorded.</li>
              <li>The timer continues after page refresh.</li>
              <li>The assessment submits automatically when time expires.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleStartAssessment}
            className="btn-primary mt-6"
          >
            Start Assessment
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (assessmentLocked) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Title
          title="Assessment Locked"
          subtitle="An activity was detected during exam mode."
        />

        <div className="card p-8 text-center">
          <div className="text-5xl">🔒</div>
          <h2 className="mt-4 text-xl font-black text-red-700">Assessment Locked</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Tab switching or fullscreen exit was detected. This event has been recorded.
          </p>

          {warningMessage && (
            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-xs text-amber-800">
              {warningMessage}
            </div>
          )}

          <button
            type="button"
            onClick={continueAssessment}
            className="btn-primary mt-6"
          >
            Continue Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Title
        title="Personalized Skill Assessment"
        subtitle={`Questions are generated from your career goal: ${careerGoal}. A new randomized set is created for each attempt.`}
      />

      <div className="sticky top-2 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div>
          <span className="badge bg-violet-50 text-violet-700">
            CAREER: {careerGoal}
          </span>
          <p className="mt-1 text-xs text-slate-500">
            {answered}/{questions.length} answered
          </p>
        </div>

        <div
          className={`rounded-xl px-4 py-2 font-mono text-lg font-black ${
            safeTimeLeft < 60
              ? 'bg-red-50 text-red-700'
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          ⏱ {mins}:{secs}
        </div>
      </div>

      {warningMessage && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          {warningMessage}
        </div>
      )}

      <div className="card p-6">
        <div className="mb-5 rounded-xl bg-amber-50 p-4 text-xs text-amber-800">
          <b>Assessment mode:</b> Exam activity such as tab switching, focus changes
          and fullscreen exit may be recorded. Browser monitoring is not perfect security.
        </div>

        <div className="space-y-7">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="border-b border-slate-100 pb-6 last:border-0"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="badge bg-cyan-50 text-cyan-700">
                  {question.domain}
                </span>
                <span className="text-xs text-slate-400">
                  {index + 1}/{questions.length}
                </span>
              </div>

              <p className="mt-3 font-semibold">{question.question}</p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => {
                      setAnswers((previousAnswers) => {
                        const nextAnswers = {
                          ...previousAnswers,
                          [question.id]: option,
                        };
                        answersRef.current = nextAnswers;
                        return nextAnswers;
                      });
                      recordAssessmentEvent('ANSWER_CHANGED');
                    }}
                    className={`rounded-xl border p-3 text-left text-sm ${
                      answers[question.id] === option
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                        : 'border-slate-200 hover:border-cyan-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={answered !== questions.length}
          className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => submitAssessment(false)}
        >
          Submit Assessment
          <ArrowRight size={16} />
        </button>

        {answered !== questions.length && (
          <p className="mt-2 text-xs text-slate-400">
            Answer all questions to submit manually. The timer will automatically
            submit the assessment when it reaches zero.
          </p>
        )}
      </div>
    </div>
  );
}
type AssessmentQuestion={id:string;domain:string;category:'Technical'|'Soft Skills'|'Aptitude';question:string;answer:string;options:string[]};
const shuffle=<T,>(items:T[])=>{for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}return items};
function getAssessmentQuestions(goal:string):AssessmentQuestion[]{
 const g=goal.toLowerCase();
 let technical:AssessmentQuestion[];
 if(g.includes('data analyst')) technical=[
  {id:'da1',domain:'SQL',category:'Technical',question:'Which SQL clause filters grouped results?',answer:'HAVING',options:['HAVING','WHERE','ORDER BY','LIMIT']},
  {id:'da2',domain:'Python',category:'Technical',question:'Which Python library is widely used for tabular data?',answer:'Pandas',options:['Pandas','React','JUnit','Spring']},
  {id:'da3',domain:'Statistics',category:'Technical',question:'Which measure represents the middle value of ordered data?',answer:'Median',options:['Median','Variance','Range','Mean']},
  {id:'da4',domain:'Power BI',category:'Technical',question:'Which Power BI feature helps transform data before visualization?',answer:'Power Query',options:['Power Query','PowerPoint','Git','JDBC']}
 ];
 else if(g.includes('ai')||g.includes('machine learning')) technical=[
  {id:'ai1',domain:'AI/ML',category:'Technical',question:'Which learning approach uses labelled examples?',answer:'Supervised learning',options:['Supervised learning','Unsupervised learning','Random search','Rendering']},
  {id:'ai2',domain:'Python',category:'Technical',question:'Which library is widely used for numerical arrays?',answer:'NumPy',options:['NumPy','React','Spring','Figma']},
  {id:'ai3',domain:'ML Evaluation',category:'Technical',question:'What is a model output in a prediction task?',answer:'Prediction',options:['Prediction','CSS rule','Database table','Route']},
  {id:'ai4',domain:'Statistics',category:'Technical',question:'What does standard deviation describe?',answer:'Spread of values',options:['Spread of values','A database key','A web route','A UI component']}
 ];
 else if(g.includes('cloud')) technical=[
  {id:'cl1',domain:'Cloud Computing',category:'Technical',question:'Which model provides virtualized compute infrastructure?',answer:'IaaS',options:['IaaS','SaaS','HTML','CSS']},
  {id:'cl2',domain:'Containers',category:'Technical',question:'Which technology packages an application with its dependencies?',answer:'Docker',options:['Docker','Figma','SQL','React']},
  {id:'cl3',domain:'Networking',category:'Technical',question:'Which protocol is commonly used for secure web traffic?',answer:'HTTPS',options:['HTTPS','FTP','SMTP','POP3']},
  {id:'cl4',domain:'Security',category:'Technical',question:'What is the purpose of least privilege?',answer:'Limit access to what is needed',options:['Limit access to what is needed','Give everyone admin access','Disable logging','Remove authentication']}
 ];
 else if(g.includes('cyber')) technical=[
  {id:'cy1',domain:'Networking',category:'Technical',question:'Which protocol is commonly used to resolve domain names?',answer:'DNS',options:['DNS','FTP','SMTP','SSH']},
  {id:'cy2',domain:'Security',category:'Technical',question:'What does multi-factor authentication add?',answer:'An additional verification factor',options:['An additional verification factor','A database index','A CSS rule','A faster CPU']},
  {id:'cy3',domain:'Linux',category:'Technical',question:'Which principle limits a user to only necessary permissions?',answer:'Least privilege',options:['Least privilege','Open access','Replication','Rendering']},
  {id:'cy4',domain:'Cryptography',category:'Technical',question:'What is encryption primarily used for?',answer:'Protecting data confidentiality',options:['Protecting data confidentiality','Increasing screen size','Sorting arrays','Compiling code']}
 ];
 else technical=[
  {id:'sw1',domain:'Software Engineering',category:'Technical',question:'What is version control mainly used for?',answer:'Tracking code changes',options:['Tracking code changes','Hosting videos','Designing logos','Compiling hardware']},
  {id:'sw2',domain:'Data Structures',category:'Technical',question:'Which structure follows FIFO?',answer:'Queue',options:['Queue','Stack','Tree','Heap']},
  {id:'sw3',domain:'Databases',category:'Technical',question:'What does a primary key identify?',answer:'A unique row',options:['A unique row','A chart','A CSS rule','A duplicate row']},
  {id:'sw4',domain:'APIs',category:'Technical',question:'Which data format is commonly used for web API payloads?',answer:'JSON',options:['JSON','JPEG','MP3','EXE']}
 ];
 technical = technical.concat([
  {id:`${g.slice(0,8)}-t5`,domain:'Problem Solving',category:'Technical',question:`For a ${goal} workflow, what is the best first step when requirements are unclear?`,answer:'Clarify requirements and acceptance criteria',options:['Clarify requirements and acceptance criteria','Start coding immediately','Skip testing','Publish unfinished work']},
  {id:`${g.slice(0,8)}-t6`,domain:'Quality',category:'Technical',question:'Which practice helps prevent regressions when software changes?',answer:'Automated testing',options:['Automated testing','Removing version control','Skipping reviews','Deleting test cases']},
  {id:`${g.slice(0,8)}-t7`,domain:'Security',category:'Technical',question:'Which practice is safest for storing user passwords?',answer:'Use a strong password hashing algorithm',options:['Use a strong password hashing algorithm','Store plaintext passwords','Put passwords in URLs','Share passwords by email']},
  {id:`${g.slice(0,8)}-t8`,domain:'Collaboration',category:'Technical',question:'What is a useful engineering practice before merging a shared code change?',answer:'Review and test the change',options:['Review and test the change','Delete the branch history','Disable CI','Avoid documentation']}
 ]);
 const common:AssessmentQuestion[]=[
  {id:'apt1',domain:'Aptitude',category:'Aptitude',question:'If 5 workers complete a task in 12 days, how many worker-days are required?',answer:'60',options:['60','17','45','72']},
  {id:'apt2',domain:'Aptitude',category:'Aptitude',question:'Find the next number: 2, 6, 12, 20, ?',answer:'30',options:['28','30','32','36']},
  {id:'apt3',domain:'Problem Solving',category:'Aptitude',question:'A train travels 120 km in 2 hours. What is its average speed?',answer:'60 km/h',options:['60 km/h','50 km/h','80 km/h','40 km/h']},
  {id:'soft1',domain:'Communication',category:'Soft Skills',question:'Which response best demonstrates active listening?',answer:'Clarify the speaker’s point before responding',options:['Clarify the speaker’s point before responding','Interrupt with your solution','Ignore the concern','Change the topic']},
  {id:'soft2',domain:'Teamwork',category:'Soft Skills',question:'A teammate misses a deadline. What is the most constructive first response?',answer:'Discuss the blocker and agree on a recovery plan',options:['Discuss the blocker and agree on a recovery plan','Blame the teammate publicly','Ignore the missed deadline','Immediately remove the teammate']},
  {id:'soft3',domain:'Teamwork',category:'Soft Skills',question:'Which behaviour best supports effective collaboration?',answer:'Share information, ask questions and respect different views',options:['Share information, ask questions and respect different views','Work without communicating','Avoid feedback','Make every decision alone']},
  {id:'apt4',domain:'Aptitude',category:'Aptitude',question:'A product priced at 800 is discounted by 10%. What is the sale price?',answer:'720',options:['720','710','780','880']},
  {id:'apt5',domain:'Problem Solving',category:'Aptitude',question:'Which approach is most useful when a problem has many possible causes?',answer:'Break it into hypotheses and test them',options:['Break it into hypotheses and test them','Guess once and stop','Ignore evidence','Change everything at once']},
  {id:'soft4',domain:'Communication',category:'Soft Skills',question:'What is the clearest way to communicate a project blocker?',answer:'State the blocker, impact and requested help',options:['State the blocker, impact and requested help','Hide the blocker','Send an unclear one-word message','Wait until the deadline']},
  {id:'soft5',domain:'Adaptability',category:'Soft Skills',question:'A requirement changes late in a project. What is a constructive response?',answer:'Assess impact, align with stakeholders and update the plan',options:['Assess impact, align with stakeholders and update the plan','Ignore the change','Blame the requester','Delete the project']}
 ];
 return shuffle([...common,...technical]);
}

function AssessmentResults(){const u:any=getMyData(); const a=u?.assessment; return <div className="space-y-5"><div className="card p-7"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-black">Assessment complete</h2><p className="mt-1 text-sm text-slate-500">Your results are saved to your profile and drive Skill Gap analysis.</p></div><div className="grid h-24 w-24 place-items-center rounded-full bg-cyan-50 text-3xl font-black text-cyan-700">{a?.overall||0}%</div></div><div className="mt-6 grid gap-4 sm:grid-cols-4">{[['Technical',a?.technical],['Soft Skills',a?.soft],['Aptitude',a?.aptitude],['Communication',a?.communication]].map(x=><div className="rounded-xl bg-slate-50 p-4" key={x[0] as string}><b>{x[1]}%</b><p className="text-xs text-slate-500">{x[0]}</p></div>)}</div></div><div className="grid gap-5 md:grid-cols-2"><div className="card p-6"><h2 className="font-bold">Current Strengths</h2>{(a?.strengths||[]).map((x:string)=><div className="mt-3 flex items-center gap-2 text-sm" key={x}><Check size={15} className="text-emerald-500"/>{x}</div>)}</div><div className="card p-6"><h2 className="font-bold">Skill Gap</h2>{(a?.gaps||[]).map((x:string)=><div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-800" key={x}>{x} · Needs development</div>)}</div></div></div>}

export function Skills(){const u:any=getMyData(); const a=u?.assessment; const skills=(a?.strengths||['JavaScript','React','SQL','Communication','Problem Solving']).map((s:string,i:number)=>({s,v:Math.min(95,Math.max(45,(a?.overall||78)+(i%3)*4-2))})); const gaps=a?.gaps||['Cloud Computing','System Design','Testing'];return <div className="space-y-6"><Title title="Skill Profile & Skill Gap" subtitle="Detailed assessment results live here after completion; the dashboard shows only a compact snapshot."/><div className="grid gap-6 lg:grid-cols-[1fr_340px]"><div className="card p-6"><h2 className="font-bold">Current skills</h2><div className="mt-6 space-y-5">{skills.map((x:{s:string;v:number})=><ProgressBar key={x.s} label={x.s} value={x.v}/>)}</div></div><div className="card p-6"><h2 className="font-bold">Identified Skill Gaps</h2>{gaps.map((g:string)=><div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-800" key={g}>{g}</div>)}<h2 className="mt-6 font-bold">Recommended Skills</h2>{gaps.map((g:string)=><div className="mt-2 text-sm text-slate-600" key={g}>• Develop {g}</div>)}</div></div></div>}
export function Careers(){
 const u:any=getMyData(); const skills:string[]=u?.profile?.currentSkills||[]; const gaps:string[]=u?.assessment?.gaps||['System Design','Cloud Computing']; const role=String(u?.profile?.desiredJobRole||u?.profile?.careerGoal||'Software Developer');
 const ops=getOpportunities();
 const related=ops.filter(o=>['Job','Internship'].includes(o.type)).map(o=>{const hits=o.skills.filter(s=>[...skills,...gaps].some(x=>x.toLowerCase()===s.toLowerCase())).length; const roleHit=o.title.toLowerCase().includes(role.toLowerCase())||role.toLowerCase().includes(o.title.toLowerCase().split(' ')[0]); return {...o,match:Math.min(99,55+hits*10+(roleHit?20:0))}}).sort((a,b)=>b.match-a.match).slice(0,6);
 const certs=gaps.map((g:string)=>`${g} Professional Certificate`); const training=gaps.map((g:string)=>`Practical ${g} Training`);
 return <div className="space-y-6"><Title title="AI Career Advisor" subtitle="Personalized guidance based on your Career Goal, Desired Job Role, Programming Languages, existing skills and AI-identified Skill Gaps."/>
 <div className="card p-6"><div className="flex items-center gap-3"><Sparkles className="text-cyan-600"/><div><h2 className="font-bold">{role} readiness plan</h2><p className="text-sm text-slate-500">Current skills: {skills.length?skills.join(', '):'Add your skills in your profile'}.</p></div></div>
 <div className="mt-5 flex flex-wrap gap-2">{gaps.map(g=><span className="badge bg-amber-50 text-amber-800" key={g}>Skill Gap: {g}</span>)}</div></div>
 <section><h2 className="mb-3 font-bold">Recommended Jobs & Internships</h2><div className="grid gap-4 md:grid-cols-2">{related.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}</div></section>
 <div className="grid gap-5 md:grid-cols-3"><div className="card p-6"><h2 className="font-bold">Recommended Video Learning</h2>{gaps.map((g:string)=><div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm" key={g}><BookOpen className="mr-2 inline text-cyan-600" size={15}/> <span className="font-semibold">{g} Fundamentals</span><p className="mt-1 text-xs text-slate-500">Watch the suggested video, pass the related questions and earn a certificate.</p><Link className="mt-2 inline-flex text-xs font-black text-cyan-700" to={`/student/learning?subject=${encodeURIComponent(subjectForSkill(g))}`}>Watch related videos →</Link></div>)}</div><div className="card p-6"><h2 className="font-bold">Certifications</h2>{certs.map(x=><div className="mt-3 rounded-xl bg-violet-50 p-3 text-sm" key={x}><Award className="mr-2 inline text-violet-600" size={15}/>{x}</div>)}</div><div className="card p-6"><h2 className="font-bold">Learning Resources & Skills</h2>{training.map(x=><div className="mt-3 rounded-xl bg-cyan-50 p-3 text-sm" key={x}>{x}</div>)}<p className="mt-4 text-xs text-slate-500">These recommendations use your selected career goal, current skills and assessment Skill Gaps.</p></div></div>
 </div>
}
export function Learning(){
 const [u,setU]=useState<any>(getMyData());
 const [params]=useSearchParams();
 const {subject:legacySubject}=useParams();
 const requestedSubject=params.get('subject') || legacySubject;
 const requestedTopic=params.get('topic');
 const initialSubject=LEARNING_SUBJECTS.includes((requestedSubject||'') as any) ? String(requestedSubject) : subjectForSkill(requestedSubject || undefined);
 const [subject,setSubject]=useState(initialSubject);
 const [topic,setTopic]=useState(requestedTopic||'SQL Joins');
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [quizDone,setQuizDone]=useState(false);
 const [videoWatched,setVideoWatched]=useState(false);
 const [completed,setCompleted]=useState(false);
 const [certificate,setCertificate]=useState<any>(null);

 const lessons:any[]=[
  {id:'dbms',subject:'DBMS',topic:'SQL Joins',title:'SQL Joins — INNER, LEFT, RIGHT & FULL',duration:'18 min',difficulty:'Intermediate',skill:'SQL',video:'https://www.youtube-nocookie.com/embed/HXV3zeQKqGY',learn:['Understand relational joins','Choose the right join for a query','Combine tables using practical SQL'],quiz:[['Which SQL join returns matching rows from both tables?','INNER JOIN'],['What is the purpose of a primary key?','Uniquely identify a row'],['Which operation combines related tables?','JOIN']]},
  {id:'java',subject:'Java',topic:'Object-Oriented Programming',title:'Java OOP — Classes, Objects & Inheritance',duration:'24 min',difficulty:'Intermediate',skill:'Java',video:'https://www.youtube-nocookie.com/embed/eIrMbAQSU34',learn:['Understand classes and objects','Use inheritance and polymorphism','Build reusable Java code'],quiz:[['Which keyword creates a subclass relationship in Java?','extends'],['Which concept hides internal implementation details?','Encapsulation'],['What is an instance of a class called?','Object']]},
  {id:'python',subject:'Python',topic:'Python Fundamentals',title:'Python Programming — Beginner to Intermediate',duration:'22 min',difficulty:'Beginner',skill:'Python',video:'https://www.youtube-nocookie.com/embed/rfscVS0vtbw',learn:['Write Python programs','Use functions and data structures','Prepare for data analysis'],quiz:[['Which keyword defines a Python function?','def'],['Which structure stores key-value pairs?','Dictionary'],['Which library is widely used for dataframes?','Pandas']]},
  {id:'dsa',subject:'Data Structures',topic:'Arrays & Algorithms',title:'Data Structures & Algorithms — Core Concepts',duration:'26 min',difficulty:'Intermediate',skill:'DSA',video:'https://www.youtube-nocookie.com/embed/RBSGKlAvoiM',learn:['Understand common data structures','Analyze algorithm complexity','Choose efficient approaches'],quiz:[['Which structure follows LIFO?','Stack'],['Which structure follows FIFO?','Queue'],['What does Big-O describe?','Complexity']]},
  {id:'web',subject:'Web Development',topic:'React Fundamentals',title:'React JS — Components, Props & State',duration:'20 min',difficulty:'Intermediate',skill:'React',video:'https://www.youtube-nocookie.com/embed/SqcY0GlETPk',learn:['Build component-based UIs','Use props and state','Structure a React application'],quiz:[['What is a React reusable UI unit?','Component'],['What is commonly used for local component data?','State'],['What passes data from parent to child?','Props']]},
  {id:'aiml',subject:'AI/ML',topic:'Machine Learning Basics',title:'Machine Learning — Concepts & Workflow',duration:'25 min',difficulty:'Intermediate',skill:'Machine Learning',video:'https://www.youtube-nocookie.com/embed/i_LwzRVP7bg',learn:['Understand ML terminology','Follow a model-building workflow','Recognize supervised learning tasks'],quiz:[['What does ML stand for?','Machine Learning'],['Which learning uses labeled examples?','Supervised'],['What is a model trained to make?','Predictions']]},
  {id:'cloud',subject:'Cloud Computing',topic:'Cloud Fundamentals',title:'Cloud Computing — AWS & Core Concepts',duration:'21 min',difficulty:'Beginner',skill:'AWS',video:'https://www.youtube-nocookie.com/embed/ulprqHHWlng',learn:['Understand cloud service models','Learn core AWS concepts','Recognize deployment options'],quiz:[['Which model provides virtualized compute infrastructure?','IaaS'],['What does AWS provide?','Cloud services'],['Which model delivers software over the internet?','SaaS']]},
  {id:'os',subject:'Operating Systems',topic:'Processes & Threads',title:'Operating Systems — Processes, Threads & Scheduling',duration:'19 min',difficulty:'Intermediate',skill:'Operating Systems',video:'https://www.youtube-nocookie.com/embed/26QPDBe-NB8',learn:['Differentiate processes and threads','Understand scheduling','Connect concepts to real systems'],quiz:[['Which is usually the smaller execution unit?','Thread'],['What decides CPU execution order?','Scheduler'],['A process has its own what?','Address space']]},
  {id:'dbms-normalization',subject:'DBMS',topic:'Normalization',title:'DBMS Normalization — 1NF, 2NF, 3NF',duration:'20 min',difficulty:'Intermediate',skill:'DBMS',video:'https://www.youtube-nocookie.com/embed/Ga2bCz3g0Xo',learn:['Understand functional dependencies','Reduce redundancy with normal forms','Apply normalization to relational schemas'],quiz:[['What is the main goal of normalization?','Reduce redundancy'],['Which normal form removes partial dependency?','2NF'],['What does 3NF address?','Transitive dependency']]},
  {id:'dbms-transactions',subject:'DBMS',topic:'Transactions',title:'DBMS Transactions — ACID Properties',duration:'17 min',difficulty:'Intermediate',skill:'DBMS',video:'https://www.youtube-nocookie.com/embed/3EJlovevfcA',learn:['Understand ACID properties','Recognize transaction states','Connect isolation to concurrency'],quiz:[['Which ACID property means all-or-nothing?','Atomicity'],['Which property preserves valid database state?','Consistency'],['Which property isolates concurrent work?','Isolation']]},
  {id:'java-collections',subject:'Java',topic:'Collections',title:'Java Collections — List, Set & Map',duration:'23 min',difficulty:'Intermediate',skill:'Java',video:'https://www.youtube-nocookie.com/embed/viTHc_4XfCA',learn:['Choose the right collection','Understand List, Set and Map','Apply collections in practical programs'],quiz:[['Which collection stores key-value pairs?','Map'],['Which collection rejects duplicates?','Set'],['Which interface represents an ordered sequence?','List']]},
  {id:'python-pandas',subject:'Python',topic:'Pandas',title:'Python Pandas — DataFrames & Data Analysis',duration:'24 min',difficulty:'Intermediate',skill:'Pandas',video:'https://www.youtube-nocookie.com/embed/vmEHCJofslg',learn:['Create DataFrames','Filter and transform data','Prepare data for analytics'],quiz:[['What is the main tabular structure in Pandas?','DataFrame'],['Which method previews rows?','head'],['Which library is commonly paired with Pandas for arrays?','NumPy']]},
  {id:'dsa-linked',subject:'Data Structures',topic:'Linked Lists',title:'Linked Lists — Nodes, Traversal & Operations',duration:'21 min',difficulty:'Intermediate',skill:'DSA',video:'https://www.youtube-nocookie.com/embed/RBSGKlAvoiM',learn:['Understand nodes and links','Traverse a linked list','Compare arrays and linked lists'],quiz:[['A linked list is made of what?','Nodes'],['What connects linked-list nodes?','Links'],['Which structure gives direct index access?','Array']]},
  {id:'web-hooks',subject:'Web Development',topic:'React Hooks',title:'React Hooks — useState, useEffect & Custom Hooks',duration:'22 min',difficulty:'Intermediate',skill:'React',video:'https://www.youtube-nocookie.com/embed/LlvBzyy-558',learn:['Manage state with hooks','Handle effects safely','Create reusable custom hooks'],quiz:[['Which hook manages local state?','useState'],['Which hook handles side effects?','useEffect'],['Custom hooks usually start with which prefix?','use']]},
  {id:'aiml-regression',subject:'AI/ML',topic:'Regression',title:'Machine Learning Regression — From Data to Prediction',duration:'25 min',difficulty:'Intermediate',skill:'Machine Learning',video:'https://www.youtube-nocookie.com/embed/4b4MUYve_U8',learn:['Understand regression','Prepare features and targets','Evaluate prediction error'],quiz:[['Regression predicts what type of output?','Continuous'],['What is a common regression metric?','MAE'],['What is the target variable?','Value to predict']]},
  {id:'cloud-deploy',subject:'Cloud Computing',topic:'Cloud Deployment',title:'Cloud Deployment — From Application to Production',duration:'23 min',difficulty:'Intermediate',skill:'Cloud',video:'https://www.youtube-nocookie.com/embed/ulprqHHWlng',learn:['Choose a deployment model','Connect compute and database','Think about production security'],quiz:[['Which service model provides infrastructure?','IaaS'],['What stores application data persistently?','Database'],['Why use HTTPS?','Secure communication']]},
  {id:'os-deadlocks',subject:'Operating Systems',topic:'Deadlocks',title:'Operating Systems — Deadlocks & Avoidance',duration:'18 min',difficulty:'Intermediate',skill:'Operating Systems',video:'https://www.youtube-nocookie.com/embed/UVo9f9HcP8Q',learn:['Recognize deadlock conditions','Understand prevention and avoidance','Apply Banker-style reasoning'],quiz:[['Deadlock requires how many necessary conditions?','Four'],['Which condition means resources cannot be shared?','Mutual exclusion'],['Which algorithm helps avoid unsafe states?','Banker']]},
  {id:'networks',subject:'Computer Networks',topic:'TCP/IP & HTTP',title:'Computer Networks — TCP/IP, HTTP & Routing Basics',duration:'24 min',difficulty:'Intermediate',skill:'Computer Networks',video:'https://www.youtube-nocookie.com/embed/IPvYjXCsTg8',learn:['Understand TCP/IP layers','Trace an HTTP request','Connect routing to web applications'],quiz:[['Which protocol reliably transports application data?','TCP'],['Which protocol is used for web requests?','HTTP'],['What does routing determine?','Path to a destination']]},
  {id:'data-powerbi',subject:'Data Analytics',topic:'Power BI',title:'Power BI for Data Analytics — Dashboards & Insights',duration:'28 min',difficulty:'Intermediate',skill:'Power BI',video:'https://www.youtube-nocookie.com/embed/AGrl-H87pRU',learn:['Import and transform analytics data','Build meaningful Power BI visuals','Create dashboards for business decisions'],quiz:[['What is Power BI primarily used for?','Data analytics and visualization'],['What is a dashboard used to communicate?','Insights'],['Which feature helps transform data before visualization?','Power Query']]},
  {id:'data-statistics',subject:'Data Analytics',topic:'Statistics',title:'Statistics for Data Analysis — Core Concepts',duration:'26 min',difficulty:'Beginner',skill:'Statistics',video:'https://www.youtube-nocookie.com/embed/xxpc-HPKN28',learn:['Understand descriptive statistics','Interpret distributions and variability','Use statistics for data-driven decisions'],quiz:[['What does the mean represent?','Average'],['What measures spread around the mean?','Standard deviation'],['What describes the middle value of ordered data?','Median']]},

 ];
 const subjectLessons=lessons.filter(x=>x.subject===subject);
 const lesson=subjectLessons.find(x=>x.topic===topic)||subjectLessons[0]||lessons[0];
 const refresh=()=>setU(getMyData());
 const changeSubject=(s:string)=>{setSubject(s);const first=lessons.find(x=>x.subject===s);setTopic(first?.topic||'');setAnswers({});setQuizDone(false);setCompleted(false);setCertificate(null);setVideoWatched(false)};
 const checkQuiz=()=>{const ok=lesson.quiz.every((q:any[],i:number)=>answers[`q${i}`]===q[1]); if(!ok){window.alert('Please answer every question correctly before completing this module.');return;} setQuizDone(true);};
 const finish=()=>{
   if(!videoWatched||!quizDone){window.alert('Complete the video and pass the Quick Check before finishing this module.');return;}
   updateLearningProgress(lesson.id,100);
   const current:string[]=u?.profile?.currentSkills||[];
   updateProfile({currentSkills:[...new Set([...current,lesson.skill])]});
   const fresh:any=getMyData();
   const issued=fresh?.certificates?.find((c:any)=>c.sourceCourseId===lesson.id) || fresh?.certificates?.[0] || null;
   setCertificate(issued);
   setCompleted(true);
   setU(fresh);
 };
 const item=u?.learning?.find((x:any)=>x.id===lesson.id);
 const displayCertificate=certificate || u?.certificates?.find((c:any)=>c.sourceCourseId===lesson.id) || null;
 return <div className="space-y-6">
  <Title title="Smart Learning Session" subtitle="Learn the exact subject connected to your career roadmap — watch, check, practice and update your skill evidence."/>
  <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
   <aside className="card h-fit p-4">
    <div className="flex items-center gap-2"><Sparkles size={17} className="text-violet-600"/><h2 className="font-black">Subjects</h2></div>
    <div className="mt-4 space-y-1">{LEARNING_SUBJECTS.map(s=><button key={s} onClick={()=>changeSubject(s)} className={`w-full rounded-xl px-3 py-2.5 text-left text-xs font-black transition ${subject===s?'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md':'text-slate-600 hover:bg-slate-50'}`}>{s}</button>)}</div>
   </aside>
   <main className="space-y-5">
    <div className="card p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div><label className="label">Selected course / subject</label><select className="input" value={subject} onChange={e=>changeSubject(e.target.value)}>{Array.from(new Set(lessons.map(x=>x.subject))).map(x=><option key={x}>{x}</option>)}</select></div>
        <div><label className="label">Topic-specific video</label><select className="input" value={topic} onChange={e=>{setTopic(e.target.value);setAnswers({});setQuizDone(false);setCompleted(false);setCertificate(null);setVideoWatched(false)}}>{lessons.filter(x=>x.subject===subject).map(x=><option key={x.id}>{x.topic}</option>)}</select></div>
      </div>
      <p className="mt-3 text-[10px] font-semibold text-slate-400">EduLyra filters every video by <b>course + topic</b>; unrelated videos are never mixed into this lesson.</p>
    </div>
    <div className="card overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1.35fr_.65fr]">
       <div className="bg-slate-950 p-2">
        <iframe className="aspect-video w-full rounded-2xl" src={lesson.video} title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/><div className="mt-2 rounded-xl bg-white/10 p-3 text-xs text-white"><label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={videoWatched} onChange={e=>{setVideoWatched(e.target.checked);if(e.target.checked){updateLearningProgress(lesson.id,50);recordVideoCompletion(lesson.id,lesson.title);setU(getMyData())}}}/> I completed this learning video</label><p className="mt-1 text-[10px] text-slate-400">Video completion is tracked separately from the knowledge check.</p></div>
       </div>
       <div className="p-6">
        <span className="badge-ai"><PlayCircle size={13}/> WATCH & LEARN</span>
        <h2 className="mt-3 text-2xl font-black">{lesson.title}</h2>
        <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black"><Clock3 size={12} className="mr-1 inline"/>{lesson.duration}</span><span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black text-violet-700">{lesson.difficulty}</span><span className="rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black text-cyan-700">Skill: {lesson.skill}</span></div>
        <p className="mt-5 text-xs font-black text-slate-500">What you'll learn</p>
        <ul className="mt-2 space-y-2">{lesson.learn.map((x:string)=><li key={x} className="flex gap-2 text-xs text-slate-600"><CheckCircle2 size={14} className="shrink-0 text-emerald-500"/>{x}</li>)}</ul>
        <div className="mt-5 flex gap-2">{!item?<button className="btn-primary" onClick={()=>{enrollLearning({id:lesson.id,title:lesson.title,provider:'EduLyra Learning',skills:[lesson.skill],modules:3,videoUrl:lesson.video});refresh()}}>Start Learning</button>:<span className="rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-black text-emerald-700">{item.progress>=100?'Completed ✓':`${item.progress||0}% in progress`}</span>}<a className="btn-secondary" href={lesson.video.replace('youtube-nocookie.com/embed/','youtube.com/watch?v=')} target="_blank" rel="noreferrer">Open Video <ArrowRight size={13}/></a></div>
       </div>
      </div>
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
     <section className="card p-6">
      <div className="flex items-center gap-2"><CheckCircle2 className="text-violet-600"/><div><h2 className="font-black">Quick Check</h2><p className="text-xs text-slate-400">Test your understanding before moving on.</p></div></div>
      {lesson.quiz.map((q:any[],i:number)=>{const [question,correct]=q;const id=`q${i}`;const options=[correct,`Not related to ${lesson.subject}`,`A file format`,`Deletes the ${lesson.subject} topic`];return <div key={id} className="mt-4"><p className="text-xs font-black">{question}</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{options.map((a:string)=><button key={a} onClick={()=>setAnswers({...answers,[id]:a})} className={`rounded-xl border p-2.5 text-left text-[10px] font-bold ${answers[id]===a?'border-cyan-400 bg-cyan-50':'border-slate-100 hover:bg-slate-50'}`}>{a}</button>)}</div></div>})}
      <button disabled={!videoWatched} onClick={checkQuiz} className="btn-primary mt-5 disabled:cursor-not-allowed disabled:opacity-50">Submit Quick Check</button>
      {quizDone&&<p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700">Quick Check completed. Great — your learning evidence is ready for the next step.</p>}
     </section>
     <section className="card p-6">
      <div className="flex items-center gap-2"><Code2 className="text-cyan-600"/><div><h2 className="font-black">Practice</h2><p className="text-xs text-slate-400">Apply the topic to a small real-world task.</p></div></div>
      <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white"><p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">Challenge</p><p className="mt-2 text-sm font-black">{lesson.subject==='DBMS'?'Build a query that returns every student and their completed courses, including students who have no completed course.':lesson.subject==='Java'?'Create a small Java model using a base class, a subclass and one overridden method.':lesson.subject==='Python'?'Write a Python function that cleans a list of values and returns only valid numeric entries.':lesson.subject==='Data Structures'?'Choose an appropriate data structure for a browser history and explain its operations.':lesson.subject==='Web Development'?'Build a React component that receives a title through props and manages a local counter with state.':lesson.subject==='AI/ML'?'Design a simple supervised-learning workflow from dataset to evaluation.':lesson.subject==='Cloud Computing'?'Sketch a cloud deployment for a web app with compute, database and secure access.':lesson.subject==='Data Analytics'?'Build a small dashboard plan that turns a sales dataset into three actionable business insights.':'Explain how a process creates and manages threads and how scheduling affects execution.'}</p><p className="mt-3 text-[10px] leading-5 text-slate-400">Complete the task and record the evidence in your EduLyra learning journey.</p></div>
      <button disabled={!quizDone||!videoWatched} onClick={finish} className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Mark Practice Complete & Update Skill</button>
      {completed&&<div className="mt-4 rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-black text-emerald-800">🏆 Skill Update</p><p className="mt-1 text-xs text-emerald-700">{lesson.skill} has been added to your verified learning evidence. Your Career Intelligence profile can now use this progress.</p></div>}
      {displayCertificate&&<div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4"><div className="flex items-center gap-3"><Award className="text-violet-700"/><div><p className="text-xs font-black text-violet-900">Certificate Generated</p><p className="mt-1 text-sm font-bold text-violet-800">{displayCertificate.name}</p><p className="mt-1 text-xs text-violet-700">Certificate ID: {displayCertificate.id} · Issued: {displayCertificate.issuedOn}</p><p className="mt-2 text-xs text-violet-700">Automatically added to your Resume & Digital Portfolio.</p></div></div><Link to="/student/portfolio" className="mt-3 inline-flex text-xs font-black text-violet-800 underline">View certificate in resume →</Link></div>}
     </section>
    </div>
    <div className="card p-5"><div className="flex items-center gap-3"><Database className="text-violet-600"/><div><h3 className="font-black">Connected to your Career Roadmap</h3><p className="text-xs text-slate-500">This session is linked to your target career, skill gaps, evidence and future opportunity matching.</p></div><Link to="/student/intelligence" className="ml-auto hidden items-center gap-1 text-xs font-black text-cyan-700 sm:flex">Open Career Intelligence <ChevronRight size={13}/></Link></div></div>
   </main>
  </div>
 </div>
}

export function Applications(){const u:any=getMyData();const [refresh,setRefresh]=useState(0);const apps=u?.applications||[];return <div className="space-y-6"><Title title="Application Tracking" subtitle="Every application is saved to your account and updated from recruiter actions."/><div className="grid gap-4 sm:grid-cols-4"><div className="card p-4"><b>{apps.length}</b><p className="text-xs text-slate-500">Total</p></div><div className="card p-4"><b>{apps.filter((a:any)=>a.stage==='Applied').length}</b><p className="text-xs text-slate-500">Applied</p></div><div className="card p-4"><b>{apps.filter((a:any)=>['AI Shortlisted','Interview'].includes(a.stage)).length}</b><p className="text-xs text-slate-500">In progress</p></div><div className="card p-4"><b>{apps.filter((a:any)=>a.stage==='Selected').length}</b><p className="text-xs text-slate-500">Selected</p></div></div><div className="space-y-3">{apps.map((a:any)=><div className="card p-5" key={a.id}><div className="flex flex-wrap items-center justify-between gap-4"><div><b>{a.role}</b><p className="text-sm text-slate-500">{a.company} · Applied {a.appliedDate}</p></div><span className="badge bg-cyan-50 text-cyan-700">{a.stage}</span></div><p className="mt-3 text-xs text-slate-500">{a.nextAction}{a.interviewDate?` · Interview: ${a.interviewDate}`:''}</p></div>)}{!apps.length&&<div className="card p-8 text-center text-sm text-slate-500">No applications yet. Browse opportunities and select Apply.</div>}</div></div>}

export function Portfolio(){
 const u:any=getMyData();const p:any=u?.portfolio||{};const profile=u?.profile||{};
 const resumeStrength=84;
 const resumeCertificates:any[]=(u?.certificates||[]).map((c:any)=>`• ${c.name} | Issuer: ${c.issuer} | Issued: ${c.issuedOn} | Certificate ID: ${c.id}${c.verificationUrl?` | Verification: ${c.verificationUrl}`:''}`);
 const achievements:string[]=Array.from(new Set([...(p.achievements||[]),...(Array.isArray(profile.achievements)?profile.achievements:[profile.achievements||''])].filter(Boolean)));
 const resumeText=()=>`EDULYRA RESUME\n\nName: ${u?.name||'—'}\nEmail: ${u?.email||'—'}\nCareer Goal: ${profile.careerGoal||'—'}\nDesired Role: ${profile.desiredJobRole||'—'}\n\nPROFILE\n${profile.about||'—'}\n\nSKILLS\n${(profile.currentSkills||p.skills||[]).join(', ')||'—'}\n\nCERTIFICATIONS\n${resumeCertificates.join('\n')||'—'}\n\nPROJECTS\n${(p.projects||[]).join(', ')||'—'}\n\nINTERNSHIPS\n${(p.internships||[]).join(', ')||'—'}\n\nACHIEVEMENTS\n${achievements.join('\n')||'—'}`;
 const exportResume=()=>{
   const content=resumeText().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>');
   const printWindow=window.open('','_blank','width=900,height=700');
   if(!printWindow){window.alert('Please allow pop-ups to generate your PDF resume.');return;}
   printWindow.document.write(`<!doctype html><html><head><title>EduLyra Resume</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#111;line-height:1.6}h1{font-size:24px} @media print{body{padding:20px}}</style></head><body><h1>EduLyra Resume</h1><div>${content}</div><script>window.onload=function(){window.print();}</script></body></html>`);
   printWindow.document.close();
 };
 return <div className="space-y-6">
  <div className="flex flex-wrap items-center justify-between gap-3"><Title title="Resume & Digital Portfolio" subtitle="Your professional identity is connected to skills, evidence, learning, projects and opportunities."/><div className="flex gap-2"><Link className="btn-secondary" to="/student/intelligence">Career Intelligence</Link><button className="btn-primary" onClick={exportResume}><Download size={15}/> Download Resume PDF</button></div></div>
  <div className="grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
   <div className="card p-6"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resume Strength</p><div className="mt-2 text-5xl font-black text-violet-700">{resumeStrength}%</div><div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-full w-[84%] rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"/></div><div className="mt-5 space-y-2 text-xs"><p>✓ Verified skills included</p><p>✓ Projects connected</p><p>✓ Learning evidence connected</p><p>✓ Video completion achievements included</p></div><button onClick={exportResume} className="btn-primary mt-5 w-full justify-center">Generate PDF Resume</button></div>
   <div className="card p-6"><h2 className="text-xl font-black">{u?.name}</h2><p className="mt-1 text-sm text-slate-500">{profile.desiredJobRole||profile.careerGoal||'Professional profile'} · {u?.email}</p><p className="mt-4 text-sm leading-6 text-slate-600">{profile.about||'Add a profile summary in Settings.'}</p><div className="mt-5 flex flex-wrap gap-2">{(profile.currentSkills||p.skills||[]).map((x:string)=><span className="skill-chip" key={x}>{x}</span>)}</div></div>
  </div>
  <div className="grid gap-5 md:grid-cols-2">{[['Education',[profile.education||profile.degree||'Add education in Settings']],['Certifications',p.certifications||[]],['Projects',p.projects||[]],['Experience / Internships',p.internships||[]],['Achievements',achievements]].map(([t,items]:any)=><div className="card p-5" key={t}><h2 className="font-bold">{t}</h2>{(items as string[]).filter(Boolean).map((x:string)=><div className="mt-2 rounded-xl bg-slate-50 p-3 text-sm" key={x}>{x}</div>)}</div>)}</div>
  <div className="card p-6"><div className="flex items-center gap-2"><Award className="text-violet-600"/><h2 className="font-bold">Verified Certificates</h2></div>{(u?.certificates||[]).map((c:any)=><div className="mt-3 rounded-xl border border-violet-100 bg-violet-50 p-4" key={c.id}><p className="text-sm font-bold text-violet-900">{c.name}</p><p className="mt-1 text-xs text-violet-700">{c.issuer} · {c.issuedOn} · ID: {c.id}</p><p className="mt-1 text-xs text-emerald-700">✓ Included in PDF resume</p></div>)}{!(u?.certificates||[]).length&&<p className="mt-3 text-sm text-slate-500">Complete a recommended video lesson and pass its related questions to generate your first certificate.</p>}</div>
 </div>
}
export function Notifications(){
 const [u,setU]=useState<any>(getMyData());
 const ns=u?.notifications||[];
 const smart=[
  ['🎯','Career','Readiness opportunity','Complete a top skill-gap lesson to improve your readiness.','/student/intelligence'],
  ['📚','Learning','Learning signal','Open the course-specific lesson recommended by your roadmap.',`/student/learning?subject=${encodeURIComponent(subjectForSkill((u?.assessment?.gaps||['DBMS'])[0]))}`],
  ['💼','Opportunity','New opportunity match','Review internships and jobs ranked against your verified skills.','/student/opportunities'],
  ['🏭','Industry','Industry challenge','Explore challenges where industry, students and faculty can collaborate.','/student/intelligence']
 ];
 const markAll=()=>{markAllNotifications();setU(getMyData())};
 return <div className="space-y-6">
  <div className="flex flex-wrap items-end justify-between gap-3"><Title title="Smart Notification Center" subtitle={`${ns.filter((n:any)=>!n.read).length} unread · career, learning, opportunities, industry and application signals.`}/><button className="btn-secondary" onClick={markAll} disabled={!ns.some((n:any)=>!n.read)}>Mark all as read</button></div>
  <div className="grid gap-3 md:grid-cols-2">{smart.map(([icon,type,title,body,href])=><Link to={href} className="card p-5 transition hover:-translate-y-0.5" key={title}><div className="flex items-start gap-3"><span className="text-xl">{icon}</span><div><span className="badge bg-violet-50 text-violet-700">{type}</span><h3 className="mt-2 text-sm font-black">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{body}</p><p className="mt-3 text-xs font-black text-cyan-700">Open →</p></div></div></Link>)}</div>
  <div className="space-y-3">
   {ns.map((n:any)=><button onClick={()=>{markNotification(n.id);setU(getMyData())}} className={`card flex w-full gap-4 p-5 text-left transition hover:-translate-y-0.5 ${n.read?'opacity-60':'ring-1 ring-cyan-100'}`} key={n.id}>
    <Bell className="shrink-0 text-cyan-600"/><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><b>{n.title}</b>{!n.read&&<span className="h-2 w-2 rounded-full bg-cyan-500"/>}</div><p className="mt-1 text-sm text-slate-500">{n.body}</p><p className="mt-2 text-xs text-slate-400">{n.time} · {n.read?'Read':'Unread — click to mark read'}</p></div>
   </button>)}
   {!ns.length&&<div className="card p-8 text-center text-sm text-slate-500">You're all caught up. New career, learning and application events will appear here.</div>}
  </div>
 </div>
}


export function OpportunityDetails({ id }: { id: string }) {
  const nav = useNavigate();

  const user: any = getMyData();

  const role = user?.role;

  const base =
    role === "faculty"
      ? "/faculty/opportunities"
      : "/student/opportunities";

  const opportunity = getOpportunities().find(
    (item) => item.id === id
  );

  const [done, setDone] = useState(
    !!user?.applications?.some(
      (application: any) =>
        application.opportunityId === id
    )
  );

  const [saved, setSaved] = useState(
    !!user?.profile?.savedOpportunities?.includes(id)
  );

  if (!opportunity) {
    return (
      <div className="card p-8">
        Opportunity not found.
      </div>
    );
  }

  const handleSave = () => {
    if (saved) {
      removeSavedOpportunity(opportunity.id);
      setSaved(false);
    } else {
      saveOpportunity(opportunity);
      setSaved(true);
    }
  };

  const handleApply = () => {
    if (!done) {
      applyToOpportunity(opportunity);
      setDone(true);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <button
        className="btn-secondary"
        onClick={() => nav(base)}
      >
        ← Back to opportunities
      </button>

      <div className="card p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="badge bg-cyan-50 text-cyan-700">
              {opportunity.type}
            </span>

            <h1 className="mt-3 text-3xl font-black">
              {opportunity.title}
            </h1>

            <p className="mt-1 text-slate-500">
              {opportunity.company} ·{" "}
              {opportunity.location} ·{" "}
              {opportunity.workMode}
            </p>
          </div>

          <MatchScore value={opportunity.match || 0} />
        </div>

        <p className="mt-6 leading-7 text-slate-600">
          {opportunity.description}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Compensation", opportunity.compensation],
            ["Duration", opportunity.duration || "Not specified"],
            ["Eligibility", opportunity.eligibility],
            ["Deadline", opportunity.deadline || "Not specified"],
            [
              "Required skills",
              opportunity.skills.join(", ") || "Not specified",
            ],
          ].map(([label, value]) => (
            <div
              className="rounded-xl bg-slate-50 p-4"
              key={label}
            >
              <p className="text-xs text-slate-400">
                {label}
              </p>

              <p className="mt-1 text-sm font-semibold">
                {value}
              </p>
            </div>
          ))}
        </div>

        {(role === "student" || role === "faculty") && (
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Apply Button */}
            <button
              className="btn-primary"
              disabled={done}
              onClick={handleApply}
            >
              {done
                ? "✓ Application submitted"
                : "Apply Now"}
            </button>

            {/* Save / Unsave Button */}
            <button
              className={`btn-secondary ${
                saved
                  ? "bg-violet-100 text-violet-700"
                  : ""
              }`}
              onClick={handleSave}
            >
              <Bookmark
                size={16}
                fill={saved ? "currentColor" : "none"}
              />

              {saved ? "Unsave Opportunity" : "Save Opportunity"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export function Messages(){const u:any=getMyData();const [refresh,setRefresh]=useState(0);const messages:any[]=getMessagesForUser();const groups=Array.from(new Set(messages.map((m:any)=>m.senderId===u.id?m.receiverId:m.senderId)));return <div className="space-y-6"><Title title="Messages" subtitle="Recruiter communication appears here when you are shortlisted, scheduled for an interview or selected."/>{!messages.length?<div className="card p-8 text-center text-sm text-slate-500">No recruiter messages yet. Recruitment actions will create relevant conversations automatically.</div>:groups.map(id=>{const person=allUsers().find((x:any)=>x.id===id);const thread=messages.filter((m:any)=>m.senderId===id||m.receiverId===id);return <div className="card p-5" key={id}><h2 className="font-bold">{person?.name||'Conversation'}</h2>{thread.map((m:any)=><div className={`mt-3 rounded-xl p-3 text-sm ${m.senderId===u.id?'bg-cyan-50':'bg-slate-50'}`} key={m.id}>{m.body}<p className="mt-1 text-[11px] text-slate-400">{new Date(m.createdAt).toLocaleString()}</p></div>)}</div>})}</div>}
export function Settings(){const u:any=getMyData();const [name,setName]=useState(u?.name||'');const [goal,setGoal]=useState(u?.profile?.careerGoal||'');const [role,setRole]=useState(u?.profile?.desiredJobRole||'');const [skills,setSkills]=useState((u?.profile?.currentSkills||[]).join(', '));const [about,setAbout]=useState(u?.profile?.about||'');const [education,setEducation]=useState(u?.profile?.education||u?.profile?.degree||'');const [saved,setSaved]=useState(false);return <div className="mx-auto max-w-2xl space-y-6"><Title title="Profile & Account Settings" subtitle="Changes are stored with your account and used for skill mapping, recommendations and your resume."/><div className="card p-6 space-y-4"><div><label className="label">Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)}/></div><div><label className="label">Career Goal</label><input className="input" value={goal} onChange={e=>setGoal(e.target.value)} placeholder="e.g. UI/UX Designer"/></div><div><label className="label">Desired Job Role</label><input className="input" value={role} onChange={e=>setRole(e.target.value)}/></div><div><label className="label">Skills</label><input className="input" value={skills} onChange={e=>setSkills(e.target.value)}/></div><div><label className="label">Profile / About</label><textarea className="input min-h-24" value={about} onChange={e=>setAbout(e.target.value)}/></div><div><label className="label">Education</label><input className="input" value={education} onChange={e=>setEducation(e.target.value)}/></div><button className="btn-primary" onClick={()=>{updateProfile({displayName:name,careerGoal:goal,desiredJobRole:role,currentSkills:skills.split(',').map((x:string)=>x.trim()).filter(Boolean),about,education});setSaved(true)}}>Save profile</button>{saved&&<p className="text-sm text-emerald-700">Profile settings saved successfully.</p>}</div></div>}
export function FeedbackSection() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<any[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem('edulyra_feedback') || '[]'
      );
    } catch {
      return [];
    }
  });
  const [submitted, setSubmitted] = useState(false);

  const user = getMyData();

  const submitFeedback = () => {
    if (rating === 0 || !comment.trim()) {
      window.alert('Please select a rating and write your feedback.');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      userName: user?.name || 'Anonymous Student',
      rating,
      comment: comment.trim(),
      createdAt: new Date().toLocaleDateString(),
    };

    const updatedReviews = [newReview, ...reviews];

    localStorage.setItem(
      'edulyra_feedback',
      JSON.stringify(updatedReviews)
    );

    setReviews(updatedReviews);
    setRating(0);
    setComment('');
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Form */}
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <Award className="text-violet-600" size={22} />
          <div>
            <h2 className="text-xl font-black">
              Share Your Feedback
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Help us improve your EduLyra learning experience.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-bold">
            Rate your experience
          </p>

          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition ${
                  star <= rating
                    ? 'text-yellow-400'
                    : 'text-slate-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {rating > 0
              ? `${rating} out of 5 stars`
              : 'Select your rating'}
          </p>
        </div>

        <div className="mt-5">
          <label className="label">
            Your Feedback
          </label>

          <textarea
            className="input min-h-32"
            placeholder="Write your feedback here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          className="btn-primary mt-4"
          onClick={submitFeedback}
        >
          Submit Feedback
        </button>

        {submitted && (
          <p className="mt-3 text-sm font-semibold text-emerald-600">
            Thank you! Your feedback has been submitted.
          </p>
        )}
      </div>

      {/* Reviews */}
      <div className="card p-6">
        <h2 className="text-xl font-black">
          Student Reviews
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Feedback shared by EduLyra students.
        </p>

        {reviews.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">
                    {review.userName}
                  </p>

                  <p className="text-xs text-slate-400">
                    {review.createdAt}
                  </p>
                </div>

                <div className="mt-2 text-lg text-yellow-400">
                  {'★'.repeat(review.rating)}
                  <span className="text-slate-300">
                    {'★'.repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}