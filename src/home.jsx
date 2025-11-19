import { useState, useEffect, useRef } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faBars,
  faArrowCircleRight,
  faPhone,
  faEnvelope,
  faLocationPin,
} from "@fortawesome/free-solid-svg-icons";
import { IconContext } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import selfImage from "./assets/self-image.png";
import Swal from "sweetalert2";
import CountUp from "./components/CountUp";
import { X, Image as ImageIcon } from "lucide-react";
import cv from "./assets/cv.pdf";

// Mock data untuk IconContext, Fa*, dan Fa* icons

const Navbar = ({ currentTitle, onOptionClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null); // Ref untuk menu

  // Efek untuk memantau scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Efek untuk menutup menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Hanya jalankan saat isOpen berubah

  // Fungsi untuk toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Fungsi internal untuk menangani klik, lalu memanggil prop
  const handleMenuClick = (value) => {
    setIsOpen(false); // Selalu tutup menu
    onOptionClick(value); // Panggil fungsi dari parent (Home)
  };

  return (
    <section className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-name">
        <FontAwesomeIcon icon={faCircle} style={{ fontSize: "15px" }} />
        <h1>CICUUUT</h1>
      </div>
      <div className="navbar-section-title">
        {/* Menerima judul dari props */}
        <h2>{currentTitle}</h2>
      </div>
      <div className="navbar-menu-section">
        <div className="navbar-menu" ref={pickerRef}>
          <div className="navbar-menu-button" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faBars} style={{ fontSize: "15px" }} />
            <h1>Menu</h1>
          </div>
          {/* Menu render berdasarkan state internal */}
          {isOpen && (
            <ul className="dropdown-menu">
              {/* Memanggil fungsi prop saat diklik */}
              <li onClick={() => handleMenuClick("Home")}>Home</li>
              <li onClick={() => handleMenuClick("Skills")}>Skills</li>
              <li onClick={() => handleMenuClick("Projects")}>Projects</li>
              <li onClick={() => handleMenuClick("Experiences")}>
                Experiences
              </li>
              <li onClick={() => handleMenuClick("Contact me")}>Contact Me</li>
              <li className="download-cv">
                <a href={cv} download="cv">
                  Download CV
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

const Skills = ({ title, image }) => {
  return (
    <div className="skill-item" title={title}>
      <img src={image} alt={`${title} logo`} />
      <p className="skill-title">{title}</p>
    </div>
  );
};
const Project = ({ title, desc, link, image, brief }) => {
  const [isHover, setIsHover] = useState(false);

  const handleHover = () => {
    setIsHover(!isHover);
  };

  return (
    // 'work' adalah container yang akan mendapat kelas '.hover'
    <div
      className={`work ${isHover ? "hover" : ""}`}
      onClick={handleHover}
      onMouseEnter={() => setIsHover(true)} // Saat mouse masuk
      onMouseLeave={() => setIsHover(false)} // Saat mouse keluar
    >
      <div className="project">
        <img src={image} alt={title} className="project-img" />

        {/* 'detail' berisi SEMUA info teks */}
        <div className="detail">
          <h3>{title}</h3>
          <p>{brief}</p> {/* Ini adalah <p> yang berisi 'brief' */}
        </div>
        {/* Ini adalah overlay (akan dimunculkan oleh CSS saat .hover) */}
        <div className="project-clicked">
          <p className="project-desc">{desc}</p>
          <div className="project-github">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <IconContext.Provider value={{ color: "black", size: "20px" }}>
                <div>
                  <FaGithub />
                </div>
              </IconContext.Provider>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
const Modal = ({ experience, onClose }) => {
  if (!experience) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn">
          <X size={24} />
        </button>

        <h3 className="modal-title">{experience.position}</h3>
        <p className="modal-subtitle">
          {experience.organization} ({experience.year})
        </p>

        <div className="modal-description-section">
          <p className="modal-description-text">{experience.desc}</p>
        </div>

        <div className="modal-images-grid">
          {experience.images &&
            experience.images.map((image, index) => (
              <div key={index} className="modal-image-item">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.caption}
                  className="modal-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400/cccccc/000000?text=Image+Not+Available";
                  }}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const ExperienceCard = ({ experience, onClick }) => {
  const { position, organization, year, desc, images } = experience;
  const hasImages = images && images.length > 0;

  const handleClick = () => {
    console.log("[v0] Experience card clicked:", position);
    onClick(experience);
  };

  return (
    <div
      className="experience-card"
      onClick={handleClick}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <h4 className="experience-card-title">{position}</h4>
      <h5 className="experience-card-subtitle">
        {organization}, <span className="experience-card-year">{year}</span>
      </h5>
      <p className="experience-card-desc">{desc}</p>
    </div>
  );
};

const OrganizationExperience = ({ onCardClick }) => (
  <>
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 1,
        position: "Guard Staff",
        organization: "Cultural Festival, PUSB",
        year: "2023",
        desc: "I ensured the safety and smooth flow of activities by managing crowd control, monitoring access, and responding to emergencies.  This role strengthened my communication, problem-solving, and situational awareness skills while ensuring a safe and enjoyable experience for all participants.",
        images: [
          { url: "/guard-culfest-1.jpg" },
          { url: "/guard-culfest-2.jpg" },
          { url: "/guard-culfest-3.jpg" },
          { url: "/guard-culfest-4.jpg" },
          { url: "/guard-culfest-5.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 2,
        position: "Vice Project Manager",
        organization: "Comparative Study, PUMA IT",
        year: "2023-2024",
        desc: "I helped lead the planning and execution of a program that promoted knowledge exchange and cross-cultural understanding. I collaborated on strategic planning, coordinated a diverse team, managed event logistics, engaged with institutional partners, and supported budget oversight.",
        images: [
          { url: "/comstud-2023-1.jpg" },
          { url: "/comstud-2023-2.jpg" },
          { url: "/comstud-2023-3.jpg" },
          { url: "/comstud-2023-4.jpg" },
          { url: "/comstud-2023-5.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 3,
        position: "Liaison Officer Staff",
        organization: "Company Visit, PUMA IT",
        year: "2023-2024",
        desc: "I facilitated communication and coordination between our team and partner organizations. My role involved reaching out to prospective companies, building professional relationships, and aligning company expertise with event goals.",
        images: [
          { url: "/comvis-2024-1.jpg" },
          { url: "/comvis-2024-2.jpg" },
          { url: "/comvis-2024-3.jpg" },
          { url: "/comvis-2024-4.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 4,
        position: "Member of Brand & Communication",
        organization: "Impact Circle 8.0, AIESEC in PU",
        year: "2023-2024",
        desc: "Focused on crafting impactful strategies and visuals that connect with diverse audiences. My role includes developing brand campaigns, designing engaging content, managing digital platforms, and leveraging analytics for data-driven insights.",
        images: [
          { url: "/ic-1.jpg" },
          { url: "/ic-2.jpg" },
          { url: "/ic-3.jpg" },
          { url: "/ic-4.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 5,
        position: "Guard Staff",
        organization: "CSGO, PUFA Computing",
        year: "2024",
        desc: "I ensured the safety and smooth flow of activities by managing crowd control, monitoring access, and responding to emergencies. I provided assistance to attendees, maintained surveillance for security threats, and supported event setup and teardown.",

        images: [
          { url: "/csgo-1.jpg" },
          { url: "/csgo-2.jpg" },
          { url: "/csgo-3.jpg" },
          { url: "/csgo-4.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 6,
        position: "Event Organizer Staff",
        organization: "Cultural Festival, PUSB",
        year: "2024-2025",
        desc: "I helped plan and execute a vibrant celebration that promoted cultural awareness. I led a team of international volunteers, coordinated performers, and ensured smooth on-site operations. This role strengthened my skills in event planning, team coordination, and problem-solving.",
        images: [
          { url: "/culfest2025-1.jpg" },
          { url: "/culfest2025-2.jpg" },
          { url: "/culfest2025-3.jpg" },
          { url: "/culfest2025-4.jpg" },
          { url: "/culfest2025-5.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 7,
        position: "Crowd Control Staff",
        organization: "Student and Work Abord Festival, Schoters by Ruang Guru",
        year: "2024",
        desc: "I ensure safe, organized, and enjoyable event environments. Managing large crowds, guiding attendee movement, enforcing safety protocols, and responding swiftly to potential risks or emergencies.",
        images: [
          { url: "/swaf-1.png" },
          { url: "/swaf-2.jpg" },
          { url: "/swaf-3.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 8,
        position: "PIC of Liaison Officer",
        organization: "Temu Alumni, PUMA IT",
        year: "2024",
        desc: "I led a team in managing alumni outreach, ensuring clear communication and strong participation. I was responsible for coordinating with alumni, maintaining positive relationships, and aligning their involvement with the event’s objectives.",
        images: [
          { url: "/temualumni-1.jpg" },
          { url: "/temualumni-2.jpg" },
          { url: "/temualumni-3.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 9,
        position: "Sponsorship Staff",
        organization: "Technology Exploration, PUMA IT",
        year: "2024",
        desc: "I was responsible for securing and managing partnerships to support our events. I conducted outreach to potential sponsors, created tailored proposals, and negotiated mutually beneficial agreements. I also ensured sponsor visibility through branding integration and maintained strong, ongoing relationships.",
        images: [
          { url: "/techx-1.jpg" },
          { url: "/techx-2.jpg" },
          { url: "/techx-3.jpg" },
          { url: "/techx-4.jpg" },
        ],
      }}
    />

    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 10,
        position: "Delegates Service Staff",
        organization: "LOVE YOUth, AIESEC in PU",
        year: "2024-2025",
        desc: "I conducted interviews and maintained effective communication via WhatsApp to ensure a smooth onboarding process. I built strong relationships by understanding participants’ needs, offering personalized support, and adapting to different personalities.",
        images: [{ url: "/loveyouth-1.jpg" }, { url: "/loveyouth-2.jpg" }],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 11,
        position: "Supervisor",
        organization: "Guest Lecture, PUMA IT",
        year: "2024",
        desc: "I directed the committee in bringing industry professionals to campus for a seminar. I mentored the Project Manager and Vice PM, providing strategic guidance and problem-solving support to ensure a successful event.",
        images: [
          { url: "/guest-lecture-1.jpg" },
          { url: "/guest-lecture-2.jpg" },
          { url: "/guest-lecture-3.jpg" },
          { url: "/guest-lecture-4.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 12,
        position: "Supervisor",
        organization: "Informatics Connect, PUMA IT",
        year: "2025",
        desc: "I directed committees in executing a program with a partner university. I mentored the PM and Vice PM, providing strategic guidance and helping resolve issues while overseeing all logistics. My role concluded with analyzing our findings to present a final report with actionable recommendations to our leadership.",
        images: [
          { url: "/icon-1.jpg" },
          { url: "/icon-2.jpg" },
          { url: "/icon-3.jpg" },
          { url: "/icon-4.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 13,
        position: "Liaison Officer Staff",
        organization: "Company Visit, PUMA IT",
        year: "2025",
        desc: "I facilitated communication and coordination between our team and partner organizations. My role involved reaching out to prospective companies, building professional relationships, and aligning company expertise with event goals.",

        images: [
          { url: "/comvis-2025-1.jpg" },
          { url: "/comvis-2025-2.jpg" },
          { url: "/comvis-2025-3.jpg" },
          { url: "/comvis-2025-4.jpg" },
          { url: "/comvis-2025-5.jpg" },
        ],
      }}
    />
  </>
);
const ProfessionalExperience = ({ onCardClick }) => (
  <>
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 14,
        position: "Vice of External Relation",
        organization: "PUMA IT",
        year: "2023-2024",
        desc: "I’ve played a key role in organizing major events and fostering strong collaborations with external partners. My responsibilities include coordinating event logistics, maintaining stakeholder engagement, leading internal coordination, and managing public relations.",
        images: [
          { url: "/vod-1.jpg" },
          { url: "/vod-2.jpg" },
          { url: "/vod-3.jpg" },
          { url: "/vod-4.jpg" },
          { url: "/vod-5.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 15,
        position: "CX&IR Staff",
        organization: "AFL, AIESEC in PU",
        year: "2024-2025",
        desc: "Successfully increased participant satisfaction to 93% and exceeded the target by 1.44% through excellent service, clear communication via WhatsApp, and engaging handbook design. I built strong relationships by understanding participants’ needs and adapting to different personalities.",
        images: [
          { url: "/afl-1.jpg" },
          { url: "/afl-2.jpg" },
          { url: "/afl-3.jpg" },
          { url: "/afl-4.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 16,
        position: "Head of External Relation",
        organization: "PUMA IT",
        year: "2024-2025",
        desc: "I led partnership strategies, managed stakeholder communications, and oversaw events with external parties. I also guided a team to ensure smooth execution and alignment with organizational goals.",
        images: [
          { url: "/hod-1.jpg" },
          { url: "/hod-2.jpg" },
          { url: "/hod-3.jpg" },
          { url: "/hod-4.jpg" },
        ],
      }}
    />
    <ExperienceCard
      onClick={onCardClick}
      experience={{
        id: 17,
        position: "Web Developer Intern",
        organization: "PT. Kurnia Ciptamoda Gemilang",
        year: "2025 - Present",
        desc: "I was responsible for managing weekly content refreshes for the Charles & Keith and Pedro e-commerce platforms, ensuring all product and promotional information was accurate and current. I was also responsible for revising and optimizing a library of 10+ web articles, aligning them with new product launches and current marketing campaigns.",
        images: [
          { url: "/kcg-1.jpg" },
          { url: "/kcg-2.jpg" },
          { url: "/kcg-3.jpg" },
          { url: "/kcg-4.jpg" },
        ],
      }}
    />
  </>
);
const Home = () => {
  const [activeSectionTitle, setActiveSectionTitle] = useState("Hi, I'm Cica");
  const [isDragging, setIsDragging] = useState(false);
  const [iconPositionX, setIconPositionX] = useState(0);
  const [activeTab, setActiveTab] = useState("organization");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const maxX = 100;
  const [result, setResult] = useState("");

  // Refs untuk semua section
  const homeRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const experiencesRef = useRef(null); // Nama yang benar
  const contactRef = useRef(null);

  // Efek untuk IntersectionObserver (Sudah Benar)
  useEffect(() => {
    const sections = [
      { ref: homeRef, title: "Hi, I'm Cica" },
      { ref: skillsRef, title: "Technologies I’ve Worked With" },
      { ref: projectsRef, title: "Projects Showcase" },
      { ref: experiencesRef, title: "Where I've Made Impact" }, // Nama yang benar
      { ref: contactRef, title: "Where Can You Found Me?" },
    ];

    const options = {
      root: null,
      rootMargin: "-10% 0px -80% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionData = sections.find(
            (s) => s.ref.current === entry.target
          );
          if (sectionData) {
            setActiveSectionTitle(sectionData.title);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);
    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.ref.current) {
          observer.unobserve(section.ref.current);
        }
      });
    };
  }, []); // Dijalankan sekali saat mount
  const handleOptionClick = (value) => {
    console.log(`Selected: ${value}`);
    // setIsOpen(false); // <-- INI DIHAPUS, Navbar sudah menutup dirinya sendiri
    let targetRef = null;
    switch (value) {
      case "Home":
        targetRef = homeRef;
        break;
      case "Skills":
        targetRef = skillsRef;
        break;
      case "Projects":
        targetRef = projectsRef;
        break;
      case "Experiences": // <-- NAMA DIPERBAIKI (sebelumnya "Experiances")
        targetRef = experiencesRef; // <-- TYPO DIPERBAIKI
        break;
      case "Contact me":
        targetRef = contactRef;
        break;
      case "Download CV":
        console.log("Downloading CV...");
        break;
      default:
        break;
    }

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      setIconPositionX((prevX) => {
        const newX = prevX + e.movementX;
        const minX = 0;

        if (newX < minX) return minX;
        if (newX > maxX) return maxX;
        return newX;
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIconPositionX((currentX) => {
        if (currentX >= maxX) {
          const targetSection = document.getElementById("contact-me");
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
          }
        }
        return 0;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, maxX]);
  // Fungsi untuk membuka modal (diteruskan ke ExperienceCard)
  const handleCardClick = (experience) => {
    setSelectedExperience(experience);
  };

  const closeModal = () => {
    setSelectedExperience(null);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "6ce12080-4092-4f43-ab4d-4275178314cd");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      Swal.fire({
        title: "Good job!",
        text: "The message has sent!",
        icon: "success",
      });
      event.target.reset();
    } else {
      setResult("Error");
    }
  };

  return (
    <>
      <Modal experience={selectedExperience} onClose={closeModal} />
      <Navbar
        currentTitle={activeSectionTitle}
        onOptionClick={handleOptionClick}
      />
      <section className="home" ref={homeRef}>
        <div className="home-1">
          <div className="home-about-me">
            <h1>
              Hi,{" "}
              <span className="home-about-me-name">
                {" "}
                I'm <span className="home-about-me-cica">Cica</span>
              </span>
            </h1>
            <p>
              A passionate{" "}
              <span className="home-about-web-dev">Web Developer</span> <br />{" "}
              and <b>Informatics undergraduate</b> focused on building intuitive
              and <b>creative web</b> and <b>mobile apps</b>. My coursework in{" "}
              <b>cybersecurity</b> also gives me a strong foundation in building
              apps that are not only engaging but also secure.
            </p>
            <div className="home-about-me-tagline">
              <p>
                Always learning, always exploring—let’s connect and create
                something meaningful!
              </p>
              <div className="home-about-me-contact-me">
                <FontAwesomeIcon
                  icon={faArrowCircleRight}
                  style={{
                    fontSize: "30px",
                    transform: `translateX(${iconPositionX}px)`,
                    cursor: isDragging ? "grabbing" : "grab",
                    userSelect: "none",
                    transition: isDragging ? "none" : "transform 0.3s ease-out",
                  }}
                  onMouseDown={handleMouseDown}
                />
                <span
                  className="contact-me-text"
                  style={{
                    opacity: 1 - iconPositionX / maxX,
                  }}
                >
                  Contact Me
                </span>
              </div>
            </div>
          </div>

          <div className="home-image">
            <img src={selfImage} className="self-image" alt="self image" />
          </div>
          <div className="home-numbers">
            <div>
              <h4>
                <CountUp
                  from={0}
                  to={3.88}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />{" "}
              </h4>
              <p>GPA</p>
            </div>

            <div>
              <h4>
                <CountUp
                  from={0}
                  to={6}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />{" "}
              </h4>
              <p>Work Project</p>
            </div>

            <div>
              <h4>
                <CountUp
                  from={0}
                  to={14}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />{" "}
              </h4>
              <p>Organization Experiance</p>
            </div>

            <div>
              <h4>
                <CountUp
                  from={0}
                  to={3}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />{" "}
              </h4>
              <p>Professional Experiance</p>
            </div>
          </div>
        </div>
        <div className="about-me-works">
          <div className="web-development">
            <h2>Web Development</h2>
            <p>
              build responsive, secure, and user-centric web applications,
              turning complex ideas into clean, functional, and scalable code.
            </p>
          </div>
          <div className="mobile-development">
            <h2>Mobile Development</h2>
            <p>
              create high-performance, intuitive mobile apps for Android,
              focusing on a clean UI and a seamless user experience.
            </p>
          </div>
          <div className="risk-assessment">
            <h2>Risk Assessment</h2>
            <p>
              identify, analyze, and mitigate digital threats. Find system
              vulnerabilities and provide clear strategies to strengthen
              security.
            </p>
          </div>
          <div className="digital-forensic">
            <h2>Digital Forensic</h2>
            <p>
              investigate security incidents to find the "what, where, and how."
              Trace breaches and analyze digital evidence to provide clear
              answers.
            </p>
          </div>
        </div>
      </section>

      <section className="skills" ref={skillsRef}>
        <div className="skills-image">
          <Skills image="./html.png" title="html" />
          <Skills image="/css.png" title="css" />
          <Skills image="/javascript.png" title="javascript" />
          <Skills image="/tailwind.png" title="tailwind  CSS" />
          <Skills image="/react.png" title="react js" />
          <Skills image="/php.png" title="php" />
          <Skills image="/laravel.png" title="laravel" />
          <Skills image="/python.png" title="python" />
          <Skills image="/sqllite.png" title="sqlite" />
          <Skills image="/mysql.png" title="mysql" />
          <Skills image="/mongodb.png" title="mongo db" />
          <Skills image="/express.svg" title="express js" />
          <Skills image="/java.png" title="java" />
          <Skills image="/linux.png" title="linux" />
          <Skills image="/burpsuite.png" title="burpsuite" />
          <Skills image="/wireshark.png" title="wireshark" />
          <Skills image="/autopsy.png" title="autopsy" />
          <Skills image="/docker.png" title="docker" />
          <Skills image="/git.png" title="git" />
          <Skills image="/gdocs.png" title="gdocs" />
          <Skills image="/spreadsheet.png" title="spreadsheet" />
          <Skills image="/canva.png" title="canva" />
          <Skills image="/figma.png" title="figma" />
        </div>

        <h1>Soft Skills</h1>
        <div className="soft-skills">
          <h4 className="soft-skills-a">#Teamwork</h4>
          <h4 className="soft-skills-b">#TimeManagement</h4>
          <h4 className="soft-skills-a">#Leadership</h4>
          <h4 className="soft-skills-b">#ProblemSolving</h4>
          <h4 className="soft-skills-a">#AnalyticalThinking</h4>
          <h4 className="soft-skills-b">#Adaptability</h4>
          <h4 className="soft-skills-a">#EmotionalIntelligence</h4>
        </div>
      </section>
      <section className="projects" ref={projectsRef}>
        <div className="projects-showcase">
          <Project
            image="/bunbelievable.png"
            title="Bunbelievable"
            brief="A bakery shop web application"
            desc="built with HTML, CSS, and JavaScript, I developed the category and product description pages. I focused on creating a responsive and user-friendly interface that allows users to easily explore different types of bread and view detailed product information, including images, prices, and ingredients."
            link="https://github.com/cicuut/Bunbeliveable"
          />
          <Project
            image="/lunar.jpg"
            title="LUNAR AI"
            brief="A chatbot mobile application"
            desc="integrates the OpenAI API to create a chatbot with multiple sensors, offering real-time, personalized interactions. I contributed by designing the UI/UX layouts and implementing the SQLite database for efficient data management, ensuring a seamless user experience."
            link="https://github.com/cicuut/Lunar-AI"
          />
          <Project
            image="/ticketopia.png"
            title="Ticketopia"
            brief="A ticketing web application"
            desc="I built a ticketing website using PHP and MySQL, where I developed the home page and event detail pages. The site dynamically displays events from the database, with each event page showing key info like date, location, and ticket details. This project strengthened my skills in backend development and database integration."
            link="https://github.com/cicuut/Ticketopia"
          />
          <Project
            image="/stepcure101.png"
            title="Stepcure 101"
            brief="A risk assessment web application"
            desc="designed for assessing risks and managing threat intelligence. I contributed to both the frontend and backend development, ensuring a seamless user experience and efficient data processing. The application utilizes MongoDB for data storage and integrates with the MISP API to provide real-time threat intelligence."
            link="https://github.com/cicuut/Stepcure101"
          />

          <Project
            image="/moodly.jpg"
            title="Moodly"
            brief="A to-do-list mobile application"
            desc="helps users manage tasks based on their mood. I was responsible for creating all the UI/UX layouts and implementing key functionalities, including login/logout, adding tasks, updating task status, and handling user mood input to tailor task suggestions accordingly."
            link="https://github.com/cicuut/Moodly"
          />
          <Project
            image="/portofolio.png"
            title="Personal Portofolio"
            brief="A personal portofolio web application"
            desc="Developed my personal portfolio as a responsive single-page application using React.js and Tailwind CSS. To create a dynamic and engaging user experience, I implemented various interactive UI animations (such as those found on ReactBits) to build a polished, modern interface."
            link="https://github.com/cicuut/cica-porto"
          />
        </div>
      </section>
      <section className="experiences" ref={experiencesRef}>
        <div className="experiences-navbar">
          <ul>
            <li
              className={activeTab === "organization" ? "active" : ""}
              onClick={() => setActiveTab("organization")}
            >
              Organization Experiences
            </li>
            <li
              className={activeTab === "professional" ? "active" : ""}
              onClick={() => setActiveTab("professional")}
            >
              Professional Experiences
            </li>
          </ul>
        </div>

        <div className="experiences-content">
          {activeTab === "organization" && (
            <OrganizationExperience onCardClick={handleCardClick} />
          )}
          {activeTab === "professional" && (
            <ProfessionalExperience onCardClick={handleCardClick} />
          )}
        </div>
      </section>
      <section className="contact-me" ref={contactRef}>
        <div className="contact-me-left">
          <p>
            I'm currently on the lookout for new job opportunities! If you have
            an opening that you think I'd be a good match for, or if you'd just
            like to connect, please don't hesitate to reach out. I'm always
            happy to talk about new projects, creative ideas, or how I can help
            you achieve your goals. I look forward to hearing from you!
          </p>
          <div className="contact-info">
            <div className="personal-info">
              <div>
                <FontAwesomeIcon icon={faPhone} /> 087805801599{" "}
              </div>
              <div>
                <FontAwesomeIcon icon={faEnvelope} /> 005cica@gmail.com{" "}
              </div>
              <div>
                <FontAwesomeIcon icon={faLocationPin} /> Bekasi, Indonesia
              </div>
            </div>
            <div className="social-media">
              <p>check out my social space</p>
              <div className="social-media-icons">
                <a href="https://www.instagram.com/isyaaamghfra?igsh=a3Jnd292ejlzeWdt">
                  <FaInstagram />{" "}
                </a>
                <a href="https://github.com/cicuut">
                  {" "}
                  <FaGithub />{" "}
                </a>
                <a href="https://www.linkedin.com/in/isya-maghfira-zalfa-8b707828b/">
                  <FaLinkedin />{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-me-right">
          <form onSubmit={onSubmit}>
            <div className="inputBox">
              <div className="inputField">
                <input
                  type="text"
                  placeholder="Full name"
                  id="name"
                  name="name"
                  className="item"
                  autoComplete="off"
                  required
                />
                <input
                  type="text"
                  placeholder="Email address"
                  id="email"
                  name="email"
                  className="item"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="inputField">
                <input
                  type="text"
                  placeholder="Phone number"
                  id="phone"
                  name="phone"
                  className="item"
                  autoComplete="off"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject"
                  id="subject"
                  name="subject"
                  className="item"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="message">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Your Messages"
                  className="item"
                  autoComplete="off"
                  rows="10"
                  required
                ></textarea>
              </div>
            </div>
            <button type="submit" className="btnemail">
              Send message
            </button>
          </form>
        </div>
      </section>
      <hr />
      <section className="footer" id="contact-me">
        <h3>Isya Maghfira Zalfa | Cica | Cicut </h3>
        <p>
          Informatics student | Cybersecurity enthusiast | Always curious,
          always learning.
        </p>
        <div className="social-media-footer">
          <a href="https://www.instagram.com/isyaaamghfra?igsh=a3Jnd292ejlzeWdt">
            <FaInstagram />{" "}
          </a>
          <a href="https://github.com/cicuut">
            {" "}
            <FaGithub />{" "}
          </a>
          <a href="https://www.linkedin.com/in/isya-maghfira-zalfa-8b707828b/">
            <FaLinkedin />{" "}
          </a>
        </div>
      </section>
      <hr />
      <p className="license">&copy; 2025 Cica. All rights reserved</p>
    </>
  );
};

export default Home;
