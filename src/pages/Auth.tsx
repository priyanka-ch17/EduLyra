import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
} from 'lucide-react';

import type { Role } from '../types';

import {
  signIn,
  signUp,
  getDemoPassword,
} from '../services/auth';

import { Logo } from '../components/Logo';

/* =========================================================
   ROLE OPTIONS
========================================================= */

const roles: {
  value: Role;
  label: string;
  description: string;
  icon: any;
}[] = [
  {
    value: 'student',
    label: 'Student',
    description: 'Skills, learning, internships and jobs',
    icon: GraduationCap,
  },
  {
    value: 'faculty',
    label: 'Academician',
    description: 'Research, FDPs and industry collaboration',
    icon: Users,
  },
  {
    value: 'industry',
    label: 'Industry',
    description: 'Talent, jobs, projects and recruitment',
    icon: BriefcaseBusiness,
  },
  {
    value: 'institution',
    label: 'Institution',
    description: 'Student readiness and placement analytics',
    icon: Building2,
  },
];

/* =========================================================
   PROFILE FIELDS
========================================================= */

const profileFields: Record<Role, [string, string][]> = {
  student: [
    ['college', 'College / Institution'],
    ['degree', 'Degree / Course'],
    ['department', 'Department'],
    ['graduationYear', 'Pursuing / Passed out Year'],
    ['careerGoal', 'Career Goal'],
    ['desiredJobRole', 'Desired Job Role'],
    ['jobType', 'Job Type'],
    ['programmingLanguages', 'Programming Languages'],
  ],

  faculty: [
    ['institution', 'Institution'],
    ['department', 'Department'],
    ['designation', 'Designation'],
    ['expertise', 'Areas of Expertise'],
    ['careerGoal', 'Career / Professional Goals'],
    ['preferredIndustrySectors', 'Preferred Industry Sectors'],
  ],

  industry: [
    ['companyName', 'Company Name'],
    ['industrySector', 'Industry Sector'],
    ['companyWebsite', 'Company Website'],
    ['companyDescription', 'Company Description'],
    ['recruiterContact', 'Recruiter / Contact Person'],
  ],

  institution: [
    ['institutionName', 'Institution Name'],
    ['institutionType', 'Institution Type'],
    ['address', 'Address'],
    ['contactNumber', 'Institution Contact Number'],
    ['departments', 'Departments'],
    ['numberOfStudents', 'Number of Students'],
    ['numberOfAcademicians', 'Number of Academicians'],
  ],
};

/* =========================================================
   CAREER GOALS
========================================================= */

const careerGoals = [
  'Software Developer',
  'Data Scientist',
  'Data Analyst',
  'AI/ML Engineer',
  'Cybersecurity',
  'Cloud Engineer',
  'Web Developer',
  'Mobile App Developer',
  'UI/UX Designer',
  'Product Management',
  'Business Analyst',
  'Electronics/Embedded',
  'Mechanical/Manufacturing',
  'Civil',
  'Research',
  'Higher Studies',
  'Other',
];

/* =========================================================
   INPUT HELPERS
========================================================= */

/**
 * Allows:
 * A-Z
 * a-z
 * spaces
 */
function lettersOnly(value: string): string {
  return value
    .replace(/[^A-Za-z\s]/g, '')
    .replace(/\s{2,}/g, ' ');
}

/**
 * Allows:
 * A-Z
 * a-z
 * 1
 * 2
 * 3
 * spaces
 * hyphen
 *
 * Examples:
 * SDE-1             valid
 * SDE-2             valid
 * SDE-3             valid
 * Software Developer valid
 *
 * SDE-4             invalid
 * SDE@1             invalid
 * SDE_1             invalid
 */
function jobRoleOnly(value: string): string {
  return value
    .replace(/[^A-Za-z1-3\s-]/g, '')
    .replace(/\s{2,}/g, ' ');
}

/**
 * Allows numbers only.
 */
function numbersOnly(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

/**
 * Allows:
 * A-Z
 * a-z
 * spaces
 * commas
 */
function lettersAndCommasOnly(value: string): string {
  return value
    .replace(/[^A-Za-z,\s]/g, '')
    .replace(/\s{2,}/g, ' ');
}

/**
 * Allows numbers only for phone.
 */
function phoneOnly(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

/* =========================================================
   VALIDATION REGEX
========================================================= */

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const JOB_ROLE_REGEX =
  /^[A-Za-z1-3\s-]+$/;

/* =========================================================
   AUTH COMPONENT
========================================================= */

export function Auth({
  mode,
}: {
  mode: 'login' | 'register';
}) {
  const nav = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [role, setRole] = useState<Role>('student');

  const [step, setStep] = useState(
    mode === 'register' ? 1 : 2,
  );

  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  /**
   * Field-specific validation messages.
   *
   * Example:
   *
   * {
   *   desiredJobRole: 'Invalid character "4"...',
   *   jobType: 'Invalid character "@"...'
   * }
   */
  const [inputMessage, setInputMessage] =
    useState<Record<string, string>>({});

  const [countryCode, setCountryCode] =
    useState('+91');

  const [form, setForm] =
    useState<Record<string, string>>(
      mode === 'login'
        ? {
            email: 'student@demo.com',
            password: getDemoPassword(),
          }
        : {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',

            college: '',
            degree: '',
            department: '',
            graduationYear: '',

            careerGoal: '',
            desiredJobRole: '',
            jobType: '',
            programmingLanguages: '',

            institution: '',
            designation: '',
            expertise: '',
            preferredIndustrySectors: '',

            companyName: '',
            companyDescription: '',
            industrySector: '',
            companyWebsite: '',
            recruiterContact: '',

            address: '',
            contactNumber: '',

            institutionName: '',
            institutionType: '',
            departments: '',
            numberOfStudents: '',
            numberOfAcademicians: '',
          },
    );

  /* =======================================================
     SET FORM VALUE
  ======================================================= */

  const set = (
    key: string,
    value: string,
  ) => {
    setError('');

    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* =======================================================
     SHOW FIELD VALIDATION MESSAGE
  ======================================================= */

  const showInputMessage = (
    field: string,
    message: string,
  ) => {
    setInputMessage((previous) => ({
      ...previous,
      [field]: message,
    }));

    window.setTimeout(() => {
      setInputMessage((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[field];

        return updated;
      });
    }, 2500);
  };

  /* =======================================================
     HANDLE PROFILE FIELD CHANGE
  ======================================================= */

  const handleProfileFieldChange = (
    key: string,
    value: string,
  ) => {
    /* =====================================================
       DESIRED JOB ROLE / JOB TYPE
    ===================================================== */

    if (
      key === 'desiredJobRole' ||
      key === 'jobType'
    ) {
      const invalidCharacter =
        value.match(
          /[^A-Za-z1-3\s-]/,
        );

      if (invalidCharacter) {
        showInputMessage(
          key,
          `Invalid character "${invalidCharacter[0]}". Only letters, numbers 1-3, spaces and hyphen (-) are allowed.`,
        );
      }

      set(
        key,
        jobRoleOnly(value),
      );

      return;
    }

    /* =====================================================
       GRADUATION YEAR
    ===================================================== */

    if (key === 'graduationYear') {
      const cleaned =
        numbersOnly(value).slice(0, 4);

      if (
        value !== cleaned &&
        /[^0-9]/.test(value)
      ) {
        showInputMessage(
          key,
          'Only numbers are allowed for Graduation Year.',
        );
      }

      set(key, cleaned);

      return;
    }

    /* =====================================================
       PROGRAMMING LANGUAGES
    ===================================================== */

    if (
      key === 'programmingLanguages'
    ) {
      const cleaned =
        lettersAndCommasOnly(value);

      if (
        value !== cleaned &&
        /[^A-Za-z,\s]/.test(value)
      ) {
        showInputMessage(
          key,
          'Only letters, spaces and commas are allowed.',
        );
      }

      set(key, cleaned);

      return;
    }

    /* =====================================================
      INSTITUTION CONTACT NUMBER
    ===================================================== */

    if (key === 'contactNumber') {
      const cleaned = numbersOnly(value).slice(0, 10);

      if (value !== cleaned) {
        showInputMessage(
          key,
          'Only numbers are allowed for Institution Contact Number.',
        );
      }

      set(key, cleaned);

      return;
    }

    /* =====================================================
       COLLEGE / DEGREE / DEPARTMENT
    ===================================================== */

    if (
      key === 'college' ||
      key === 'degree' ||
      key === 'department'
    ) {
      const cleaned =
        lettersOnly(value);

      if (
        value !== cleaned &&
        /[^A-Za-z\s]/.test(value)
      ) {
        showInputMessage(
          key,
          'Only alphabet letters (A-Z, a-z) and spaces are allowed.',
        );
      }

      set(key, cleaned);

      return;
    }

    /* =====================================================
       DEFAULT
    ===================================================== */

    set(key, value);
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const submit = async (
    e: FormEvent,
  ) => {
    e.preventDefault();

    setError('');

    /* =====================================================
       REGISTER STEP 1
    ===================================================== */

    if (
      mode === 'register' &&
      step === 1
    ) {
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      /* ===================================================
         LOGIN
      =================================================== */

      if (mode === 'login') {
        const email = String(
          form.email,
        )
          .trim()
          .toLowerCase();

        if (!email) {
          throw new Error(
            'Email address is required.',
          );
        }

        if (
          !EMAIL_REGEX.test(email)
        ) {
          throw new Error(
            'Enter a valid email address.',
          );
        }

        if (
          !String(
            form.password,
          ).trim()
        ) {
          throw new Error(
            'Password is required.',
          );
        }

        const u = await signIn(
          email,
          form.password,
        );

        nav('/' + u.role, {
          replace: true,
        });

        return;
      }

      /* ===================================================
         REQUIRED FIELDS
      =================================================== */

      const required = [
        'email',
        'phone',
        'password',
        'confirmPassword',

        ...(role === 'student' ||
        role === 'faculty'
          ? ['name']
          : []),

        ...profileFields[role].map(
          ([field]) => field,
        ),
      ];

      const missing =
        required.find(
          (key) =>
            !String(
              form[key] ?? '',
            ).trim(),
        );

      if (missing) {
        throw new Error(
          'Please complete all required fields.',
        );
      }

      /* ===================================================
         EMAIL VALIDATION
      =================================================== */

      const email = String(
        form.email,
      )
        .trim()
        .toLowerCase();

      if (
        !EMAIL_REGEX.test(email)
      ) {
        throw new Error(
          'Enter a valid email address.',
        );
      }

      /* ===================================================
         PHONE VALIDATION
      =================================================== */

      const phone = phoneOnly(
        String(form.phone),
      );

      const phoneRules: Record<
        string,
        [number, number]
      > = {
        '+91': [10, 10],
        '+1': [10, 10],
        '+44': [10, 10],
        '+61': [9, 9],
        '+65': [8, 8],
      };

      const [
        minPhone,
        maxPhone,
      ] =
        phoneRules[countryCode] ??
        [7, 15];

      if (
        phone.length < minPhone ||
        phone.length > maxPhone
      ) {
        throw new Error(
          `Enter a valid phone number for ${countryCode}.`,
        );
      }

      /* ===================================================
         GRADUATION YEAR VALIDATION
      =================================================== */

      if (role === 'student') {
        const graduationYear =
          String(
            form.graduationYear,
          ).trim();

        if (
          !/^\d{4}$/.test(
            graduationYear,
          )
        ) {
          throw new Error(
            'Graduation Year must contain exactly 4 numbers.',
          );
        }

        const year = Number(
          graduationYear,
        );

        const currentYear =
          new Date().getFullYear();

        if (
          year < 1950 ||
          year > currentYear + 10
        ) {
          throw new Error(
            `Enter a valid Graduation Year between 1950 and ${
              currentYear + 10
            }.`,
          );
        }
      }

      /* ===================================================
         JOB ROLE VALIDATION
      =================================================== */

      if (role === 'student') {
        const desiredJobRole =
          String(
            form.desiredJobRole,
          ).trim();

        const jobType =
          String(
            form.jobType,
          ).trim();

        if (
          !JOB_ROLE_REGEX.test(
            desiredJobRole,
          )
        ) {
          throw new Error(
            'Desired Job Role can contain only letters, numbers 1-3, spaces and hyphen (-).',
          );
        }

        if (
          !JOB_ROLE_REGEX.test(
            jobType,
          )
        ) {
          throw new Error(
            'Job Type can contain only letters, numbers 1-3, spaces and hyphen (-).',
          );
        }
      }

      /* ===================================================
         PASSWORD VALIDATION
      =================================================== */

      const password = String(
        form.password,
      );

      if (
        !PASSWORD_REGEX.test(
          password,
        )
      ) {
        throw new Error(
          'Password must be at least 10 characters and include uppercase, lowercase, number and special character.',
        );
      }

      if (
        password !==
        String(
          form.confirmPassword,
        )
      ) {
        throw new Error(
          'Password and Confirm Password must match.',
        );
      }

      /* ===================================================
         PROFILE
      =================================================== */

      const profile = {
        ...form,

        email,

        phone: `${countryCode} ${phone}`,

        emailVerificationStatus:
          'pending',

        currentSkills:
          role === 'student'
            ? String(
                form.programmingLanguages,
              )
                .split(',')
                .map(
                  (x: string) =>
                    x.trim(),
                )
                .filter(Boolean)
            : [],

        preferredIndustries:
          role === 'student'
            ? []
            : String(
                form.preferredIndustrySectors ??
                  '',
              )
                .split(',')
                .map(
                  (x: string) =>
                    x.trim(),
                )
                .filter(Boolean),
      };

      /* ===================================================
         SIGN UP
      =================================================== */

      const u = await signUp(
        form.name ||
          form.companyName ||
          form.institutionName,
        email,
        password,
        role,
        profile,
      );

      nav('/' + u.role, {
        replace: true,
      });
    } catch (err: any) {
      setError(
        err?.message ||
          'Unable to continue.',
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     CURRENT ROLE FIELDS
  ======================================================= */

  const fields =
    profileFields[role];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen landing-shell text-white">

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[.85fr_1.15fr]">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <aside className="hidden p-12 lg:flex lg:flex-col lg:justify-between">

          <Link to="/">
            <Logo dark />
          </Link>

          <div>
            <span className="badge bg-cyan-400/10 text-cyan-300">
              Connected Academia ↔ Industry
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight">
              One profile.
              <br />

              <span className="brand-gradient-text">
                One skill journey.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-slate-400 leading-7">
              Assess skills, close Skill Gaps,
              learn, get matched with
              opportunities and build a
              verified professional portfolio.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Role-based workspace',
                'Persistent multi-user profiles',
                'Explainable skill matching',
                'Automatic resume updates',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <CheckCircle2
                    size={16}
                    className="text-lime-300"
                  />

                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Problem Statement 26044 ·
            Academia–Industry collaboration
          </p>
        </aside>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <main className="bg-white p-5 text-slate-900 sm:p-8 lg:rounded-l-[36px] lg:p-12">

          <div className="mx-auto max-w-3xl">

            {/* BACK */}

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>

            {/* TITLE */}

            <div className="mt-8">
              <h2 className="text-3xl font-black">
                {mode === 'login'
                  ? 'Welcome back'
                  : 'Create your workspace'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {mode === 'login'
                  ? 'Sign in to continue your skill journey.'
                  : 'Choose your role and create a profile.'}
              </p>
            </div>

            {/* =================================================
                ROLE SELECTOR
            ================================================= */}

            {mode === 'register' && (
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

                {roles.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => {
                        setRole(
                          item.value,
                        );

                        setError('');
                      }}
                      className={`rounded-2xl border p-4 text-left ${
                        role === item.value
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <Icon size={20} />

                      <p className="mt-3 font-bold">
                        {item.label}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={submit}
              className="mt-7 space-y-5"
            >

              {/* =================================================
                  REGISTER STEP 1
              ================================================= */}

              {mode === 'register' &&
              step === 1 ? (
                <>
                  <div className="rounded-2xl bg-slate-50 p-5">

                    <p className="font-bold">
                      Step 1 of 2
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Confirm the role that
                      will control your
                      dashboard, permissions
                      and recommendations.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-400">
                    {mode === 'register'
                      ? 'Step 2 of 2 · Profile details'
                      : 'Secure login'}
                  </div>

                  {/* =================================================
                      BASIC REGISTRATION FIELDS
                  ================================================= */}

                  {mode === 'register' && (
                    <div className="grid gap-4 sm:grid-cols-2">

                      {/* FULL NAME */}

                      {(role === 'student' ||
                        role === 'faculty') && (
                        <div>
                          <label className="label">
                            Full name
                          </label>

                          <input
                            required
                            type="text"
                            autoComplete="name"
                            maxLength={100}
                            className="input"
                            value={
                              form.name
                            }
                            onChange={(e) =>
                              set(
                                'name',
                                lettersOnly(
                                  e.target.value,
                                ),
                              )
                            }
                            placeholder="Enter full name"
                          />
                        </div>
                      )}

                      {/* EMAIL */}

                      <div>
                        <label className="label">
                          Email
                        </label>

                        <input
                          required
                          type="email"
                          autoComplete="email"
                          className="input"
                          value={
                            form.email
                          }
                          onChange={(e) =>
                            set(
                              'email',
                              e.target.value,
                            )
                          }
                          placeholder="Enter email"
                        />
                      </div>

                      {/* PHONE */}

                      <div>
                        <label className="label">
                          Phone number
                        </label>

                        <div className="flex gap-2">

                          <select
                            className="input w-28"
                            value={
                              countryCode
                            }
                            onChange={(e) =>
                              setCountryCode(
                                e.target.value,
                              )
                            }
                            aria-label="Country code"
                          >
                            <option value="+91">
                              +91
                            </option>

                            <option value="+1">
                              +1
                            </option>

                            <option value="+44">
                              +44
                            </option>

                            <option value="+61">
                              +61
                            </option>

                            <option value="+65">
                              +65
                            </option>
                          </select>

                          <input
                            inputMode="numeric"
                            maxLength={15}
                            required
                            type="tel"
                            autoComplete="tel"
                            className="input"
                            value={
                              form.phone
                            }
                            onChange={(e) =>
                              set(
                                'phone',
                                phoneOnly(
                                  e.target.value,
                                ),
                              )
                            }
                            placeholder="Phone number"
                          />
                        </div>
                      </div>

                      {/* PASSWORD */}

                      <div>
                        <label className="label">
                          Password
                        </label>

                        <div className="relative">

                          <input
                            required
                            minLength={10}
                            autoComplete="new-password"
                            className="input pr-10"
                            type={
                              show
                                ? 'text'
                                : 'password'
                            }
                            value={
                              form.password
                            }
                            onChange={(e) =>
                              set(
                                'password',
                                e.target.value,
                              )
                            }
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}"
                            title="Use 10+ characters with uppercase, lowercase, number and special character."
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShow(
                                !show,
                              )
                            }
                            className="absolute right-3 top-3 text-slate-400"
                            aria-label={
                              show
                                ? 'Hide password'
                                : 'Show password'
                            }
                          >
                            {show ? (
                              <EyeOff
                                size={17}
                              />
                            ) : (
                              <Eye
                                size={17}
                              />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* CONFIRM PASSWORD */}

                      <div>
                        <label className="label">
                          Confirm password
                        </label>

                        <input
                          required
                          minLength={10}
                          autoComplete="new-password"
                          className="input"
                          type="password"
                          value={
                            form.confirmPassword
                          }
                          onChange={(e) =>
                            set(
                              'confirmPassword',
                              e.target.value,
                            )
                          }
                          placeholder="Re-enter your password"
                        />
                      </div>

                      {/* PASSWORD INFO */}

                      <div className="sm:col-span-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                        Password: 10+ characters,
                        uppercase, lowercase,
                        number and special
                        character.
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      LOGIN
                  ================================================= */}

                  {mode === 'login' && (
                    <div className="grid gap-4 sm:grid-cols-2">

                      {/* EMAIL */}

                      <div>
                        <label className="label">
                          Email
                        </label>

                        <input
                          required
                          type="email"
                          autoComplete="email"
                          className="input"
                          value={
                            form.email
                          }
                          onChange={(e) =>
                            set(
                              'email',
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      {/* PASSWORD */}

                      <div>
                        <label className="label">
                          Password
                        </label>

                        <div className="relative">

                          <input
                            required
                            autoComplete="current-password"
                            className="input pr-10"
                            type={
                              show
                                ? 'text'
                                : 'password'
                            }
                            value={
                              form.password
                            }
                            onChange={(e) =>
                              set(
                                'password',
                                e.target.value,
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShow(
                                !show,
                              )
                            }
                            className="absolute right-3 top-3 text-slate-400"
                            aria-label={
                              show
                                ? 'Hide password'
                                : 'Show password'
                            }
                          >
                            {show ? (
                              <EyeOff
                                size={17}
                              />
                            ) : (
                              <Eye
                                size={17}
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      PROFILE FIELDS
                  ================================================= */}

                  {mode === 'register' && (
                    <div className="grid gap-4 sm:grid-cols-2">

                      {fields.map(
                        ([key, label]) => {

                          /* =========================================
                             CAREER GOAL
                          ========================================= */

                          if (
                            key ===
                            'careerGoal'
                          ) {
                            return (
                              <div
                                key={key}
                              >
                                <label className="label">
                                  {label}
                                </label>

                                <select
                                  required
                                  className="input"
                                  value={
                                    form[
                                      key
                                    ] || ''
                                  }
                                  onChange={(
                                    e,
                                  ) =>
                                    set(
                                      key,
                                      e.target
                                        .value,
                                    )
                                  }
                                >
                                  <option value="">
                                    Select career
                                    goal
                                  </option>

                                  {careerGoals.map(
                                    (
                                      goal,
                                    ) => (
                                      <option
                                        key={
                                          goal
                                        }
                                        value={
                                          goal
                                        }
                                      >
                                        {goal}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </div>
                            );
                          }

                          /* =========================================
                             GRADUATION YEAR
                          ========================================= */

                          if (
                            key ===
                            'graduationYear'
                          ) {
                            return (
                              <div
                                key={key}
                              >
                                <label className="label">
                                  {label}
                                </label>

                                <input
                                  required
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={4}
                                  pattern="[0-9]{4}"
                                  className="input"
                                  value={
                                    form[
                                      key
                                    ] || ''
                                  }
                                  onChange={(
                                    e,
                                  ) =>
                                    handleProfileFieldChange(
                                      key,
                                      e.target
                                        .value,
                                    )
                                  }
                                  placeholder="2026"
                                  title="Enter a 4-digit graduation year."
                                />

                                {inputMessage[
                                  key
                                ] && (
                                  <div
                                    role="alert"
                                    className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 shadow-sm"
                                  >
                                    {
                                      inputMessage[
                                        key
                                      ]
                                    }
                                  </div>
                                )}
                              </div>
                            );
                          }

                          /* =========================================
                             PROGRAMMING LANGUAGES
                          ========================================= */

                          if (
                            key ===
                            'programmingLanguages'
                          ) {
                            return (
                              <div
                                key={key}
                              >
                                <label className="label">
                                  {label}
                                </label>

                                <input
                                  required
                                  type="text"
                                  className="input"
                                  value={
                                    form[
                                      key
                                    ] || ''
                                  }
                                  onChange={(
                                    e,
                                  ) =>
                                    handleProfileFieldChange(
                                      key,
                                      e.target
                                        .value,
                                    )
                                  }
                                  placeholder="Java, Python, JavaScript"
                                  title="Use alphabet letters, spaces and commas only."
                                />

                                {inputMessage[
                                  key
                                ] && (
                                  <div
                                    role="alert"
                                    className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 shadow-sm"
                                  >
                                    {
                                      inputMessage[
                                        key
                                      ]
                                    }
                                  </div>
                                )}
                              </div>
                            );
                          }

                          /* =========================================
                             DESIRED JOB ROLE / JOB TYPE
                          ========================================= */

                          if (
                            key ===
                              'desiredJobRole' ||
                            key ===
                              'jobType'
                          ) {
                            return (
                              <div
                                key={key}
                              >
                                <label className="label">
                                  {label}
                                </label>

                                <input
                                  required
                                  type="text"
                                  maxLength={100}
                                  className="input"
                                  value={
                                    form[
                                      key
                                    ] || ''
                                  }
                                  onChange={(
                                    e,
                                  ) =>
                                    handleProfileFieldChange(
                                      key,
                                      e.target
                                        .value,
                                    )
                                  }
                                  placeholder={
                                    key ===
                                    'desiredJobRole'
                                      ? 'e.g. Software Developer'
                                      : 'e.g. SDE-1'
                                  }
                                  pattern="^[A-Za-z1-3\s-]+$"
                                  title="Only letters, numbers 1-3, spaces and hyphen (-) are allowed."
                                />

                                {/* FIELD-LOCAL POPUP */}

                                {inputMessage[
                                  key
                                ] && (
                                  <div
                                    role="alert"
                                    className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 shadow-sm"
                                  >
                                    {
                                      inputMessage[
                                        key
                                      ]
                                    }
                                  </div>
                                )}
                              </div>
                            );
                          }

                          /* =========================================
                             COLLEGE / DEGREE / DEPARTMENT
                          ========================================= */

                          if (
                            key ===
                              'college' ||
                            key ===
                              'degree' ||
                            key ===
                              'department'
                          ) {
                            return (
                              <div
                                key={key}
                              >
                                <label className="label">
                                  {label}
                                </label>

                                <input
                                  required
                                  type="text"
                                  maxLength={150}
                                  className="input"
                                  value={
                                    form[
                                      key
                                    ] || ''
                                  }
                                  onChange={(
                                    e,
                                  ) =>
                                    handleProfileFieldChange(
                                      key,
                                      e.target
                                        .value,
                                    )
                                  }
                                  placeholder={
                                    label
                                  }
                                  pattern="^[A-Za-z\s]+$"
                                  title="Only alphabet letters (A-Z, a-z) and spaces are allowed."
                                />

                                {inputMessage[
                                  key
                                ] && (
                                  <div
                                    role="alert"
                                    className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 shadow-sm"
                                  >
                                    {
                                      inputMessage[
                                        key
                                      ]
                                    }
                                  </div>
                                )}
                              </div>
                            );
                          }

                          /* NUMBER FIELDS */

                          if (
                            key === 'numberOfStudents' ||
                            key === 'numberOfAcademicians'
                          ) {
                            return (
                              <div key={key}>
                                <label className="label">
                                  {label}
                                </label>

                                <input
                                  required
                                  type="number"
                                  min="0"
                                  step="1"
                                  inputMode="numeric"
                                  className="input"
                                  value={form[key] || ''}
                                  onChange={(e) =>
                                    set(
                                      key,
                                      e.target.value
                                    )
                                  }
                                  placeholder={label}
                                />
                              </div>
                            );
                          }

                          /* =========================================
                             OTHER PROFILE FIELDS
                          ========================================= */
                          
                          return (
                            <div
                              key={key}
                            >
                              <label className="label">
                                {label}
                              </label>

                              <input
                                required
                                type={key === 'contactNumber' ? 'tel' : 'text'}
                                inputMode={key === 'contactNumber' ? 'numeric' : undefined}
                                maxLength={key === 'contactNumber' ? 10 : undefined}
                                className="input"
                                value={
                                  form[
                                    key
                                  ] || ''
                                }
                                onChange={(e) =>
                                  handleProfileFieldChange(
                                    key,
                                    e.target.value,
                                  )
                                }
                                placeholder={
                                  label
                                }
                              />
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}

                  {/* =================================================
                      SUBMIT
                  ================================================= */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center disabled:opacity-60"
                  >
                    {loading
                      ? 'Please wait…'
                      : mode === 'login'
                        ? 'Login'
                        : 'Create account'}

                    <ArrowRight
                      size={16}
                    />
                  </button>

                  {/* =================================================
                      BACK BUTTON
                  ================================================= */}

                  {mode ===
                    'register' && (
                    <button
                      type="button"
                      onClick={() =>
                        setStep(1)
                      }
                      className="btn-secondary w-full justify-center"
                    >
                      Back
                    </button>
                  )}
                </>
              )}
            </form>

            {/* =================================================
                DEMO LOGIN MESSAGE
            ================================================= */}

            {mode === 'login' && (
              <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                Demo accounts use password{' '}
                <b>
                  {getDemoPassword()}
                </b>
                . You can also register
                local accounts.
              </p>
            )}

            {/* =================================================
                LOGIN / REGISTER LINK
            ================================================= */}

            <p className="mt-6 text-center text-sm text-slate-500">

              {mode === 'login' ? (
                <>
                  New here?{' '}

                  <Link
                    className="font-bold text-violet-700"
                    to="/register"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}

                  <Link
                    className="font-bold text-violet-700"
                    to="/login"
                  >
                    Login
                  </Link>
                </>
              )}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}