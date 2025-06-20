// Inicializar EmailJS con tu Public Key
(function() {
    emailjs.init('RRR4M2sCr-NgEf8ul');
})();

// ========== CONTADOR DE VISITAS MEJORADO ========== //
const visitCounter = {
  config: {
    repo: 'ramiju81/womo_visit',
    issueNumber: 2,
    minTimeBetweenVisits: 10000
  },
  lastVisitTime: 0,

  shouldRegisterVisit() {
    const now = Date.now();
    if (now - this.lastVisitTime < this.config.minTimeBetweenVisits) {
      console.log('Visita reciente detectada, no se registra');
      return false;
    }
    this.lastVisitTime = now;
    return true;
  },

  async registerVisitSafe() {
    if (!this.shouldRegisterVisit()) return;
    
    try {
      const visitData = {
        date: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer || 'direct',
        device: this.getDeviceType()
      };

      await this.addVisitComment(visitData);
      console.log('Visita registrada exitosamente');
    } catch (error) {
      console.error('Error registrando visita:', error);
    }
  },

  async registerVisitDev() {
    if (!this.shouldRegisterVisit()) return;
    
    try {
      if (!this.config.token) {
        const response = await fetch('womo-config.json');
        if (!response.ok) throw new Error('Archivo de configuración no encontrado');
        const config = await response.json();
        this.config.token = config.github.token;
      }

      const visitData = {
        date: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent.slice(0, 120)
      };

      await this.addVisitComment(visitData);
      console.log('Visita registrada exitosamente');
    } catch (error) {
      console.error('Error registrando visita:', error.message);
    }
  },

  async addVisitComment(visitData) {
    const response = await fetch(
      `https://api.github.com/repos/${this.config.repo}/issues/${this.config.issueNumber}/comments`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: `📍 Nueva visita:\n` +
                `- Fecha: ${new Date().toLocaleString()}\n` +
                `- Desde: ${visitData.device || visitData.userAgent?.slice(0, 50) || 'Dispositivo desconocido'}\n` +
                `- URL: ${visitData.url}\n` +
                `- Referencia: ${visitData.referrer}`
        })
      }
    );

    if (!response.ok) throw new Error('Error en la API de GitHub');
  },

  getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "mobile";
    }
    return "desktop";
  }
};

// Llamar a la función adecuada según el entorno
setTimeout(() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    visitCounter.registerVisitDev();
  } else {
    visitCounter.registerVisitSafe();
  }
}, 2000);

// Variables para el carrusel automático
let currentSlide = 0;
let slideInterval;
const slideTimes = [3000, 9000, 6000];
let hasCompletedCycle = false;
let autoCloseTimeout;

function goToNextSlide() {
    if (hasCompletedCycle) return;
    
    document.getElementById('modal-carousel').style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    
    currentSlide = (currentSlide + 1) % 3;
    document.getElementById('modal-carousel').style.transform = `translateX(-${currentSlide * 33.333}%)`;
    
    updateSlideDots();
    
    if (currentSlide === 2) {
        hasCompletedCycle = true;
        setTimeout(() => {
            resetSlides();
        }, slideTimes[2]);
        return;
    }
    
    slideInterval = setTimeout(goToNextSlide, slideTimes[currentSlide]);
}

function resetSlides() {
    document.getElementById('modal-carousel').style.transition = 'none';
    currentSlide = 0;
    document.getElementById('modal-carousel').style.transform = 'translateX(0)';
    stopAutoSlide();
    updateSlideDots();
    setTimeout(() => {
        document.getElementById('play-button').style.display = 'flex';
    }, 100);
}

function updateSlideDots() {
    const dots = document.querySelectorAll('.modal-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoSlide() {
    hasCompletedCycle = false;
    stopAutoSlide();
    document.getElementById('play-button').style.display = 'none';
    
    if (currentSlide === 2) {
        currentSlide = 0;
        document.getElementById('modal-carousel').style.transition = 'none';
        document.getElementById('modal-carousel').style.transform = 'translateX(0)';
        setTimeout(() => {
            document.getElementById('modal-carousel').style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
            slideInterval = setTimeout(goToNextSlide, slideTimes[0]);
        }, 50);
    } else {
        slideInterval = setTimeout(goToNextSlide, slideTimes[currentSlide]);
    }
    
    updateSlideDots();
    clearTimeout(autoCloseTimeout);
    autoCloseTimeout = setTimeout(closeModal, 300000);
}

function stopAutoSlide() {
    clearTimeout(slideInterval);
    slideInterval = null;
}

// ========== CÓDIGO COMPLETO DEL MODAL ========== //
const modal = document.getElementById('explanation-modal');
const closeButton = document.getElementById('modal-close');
const discoverBtn = document.getElementById('discover-btn');
const transformBtn = document.getElementById('transform-btn');
const playButton = document.getElementById('play-button');

playButton.addEventListener('click', startAutoSlide);

function openModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    currentSlide = 0;
    document.getElementById('modal-carousel').style.transition = 'none';
    document.getElementById('modal-carousel').style.transform = 'translateX(0)';
    document.getElementById('play-button').style.display = 'flex';
    stopAutoSlide();
    
    setTimeout(() => {
        document.getElementById('modal-carousel').style.transition = 'transform 0.8s ease-in-out';
    }, 50);
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    stopAutoSlide();
}

modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
});

closeButton.addEventListener('click', closeModal);
discoverBtn.addEventListener('click', openModal);

transformBtn.addEventListener('click', function() {
    closeModal();
    openContactPopup();
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    const menuLinks = document.querySelectorAll('.top-menu-link');
    menuLinks.forEach(link => link.classList.remove('active'));
    menuLinks[0].classList.add('active');
}

// Control de popup de contacto lateral
function openContactPopup() {
    document.getElementById('contact-popup').classList.add('active');
    document.body.style.overflow = 'hidden';
    closeChatbot();
}

function closeContactPopup() {
    document.getElementById('contact-popup').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function validarCampos() {
    let valido = true;
    const nombre = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const celular = document.getElementById('contact-celular').value.trim();
    const mensaje = document.getElementById('contact-message').value.trim();

    document.querySelectorAll('input, textarea').forEach(el => {
        el.style.borderColor = '#e2e8f0';
    });

    if (nombre.length < 3) {
        document.getElementById('contact-name').style.borderColor = '#EF4444';
        valido = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('contact-email').style.borderColor = '#EF4444';
        valido = false;
    }

    if (!/^\d{10}$/.test(celular)) {
        document.getElementById('contact-celular').style.borderColor = '#EF4444';
        valido = false;
    }

    if (mensaje.length < 10) {
        document.getElementById('contact-message').style.borderColor = '#EF4444';
        valido = false;
    }

    return valido;
}

async function sendContactRequest() {
    if (!validarCampos()) {
        mostrarNotificacion('Por favor complete todos los campos correctamente', 'error');
        return;
    }

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const celular = document.getElementById('contact-celular').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    const textoPlano = crearTextoPlano(name, email, celular, message);
    const datosJSON = crearDatosJSON(name, email, celular, message);

    try {
        await enviarConEmailJS(name, email, celular, textoPlano, datosJSON);
        mostrarNotificacion('¡Mensaje enviado con éxito!', 'success');
    } catch (error) {
        console.error('Error con EmailJS:', error);
        mostrarNotificacion('Usando método alternativo...', 'warning');
        
        try {
            await enviarConFormSubmit(name, email, celular, message, datosJSON);
            mostrarNotificacion('¡Mensaje enviado por método alternativo!', 'success');
        } catch (backupError) {
            console.error('Error con método alternativo:', backupError);
            mostrarNotificacion('Error: Por favor contáctenos por WhatsApp', 'error');
            return;
        }
    }

    limpiarFormulario();
    closeContactPopup();
}

function crearTextoPlano(name, email, phone, message) {
    return `
== NUEVO CONTACTO WOMO STUDIO ==
Nombre: ${name}
Email: ${email}
Teléfono: ${phone}
Mensaje: ${message}
Fecha: ${new Date().toLocaleString()}
==============================================
`;
}

function crearDatosJSON(name, email, phone, message) {
    return {
        fecha: new Date().toISOString(),
        contacto: {
            nombre: name,
            email: email,
            telefono: phone
        },
        mensaje: message,
        metadata: {
            pagina: window.location.href,
            userAgent: navigator.userAgent
        }
    };
}

async function enviarConEmailJS(name, email, phone, textoPlano, datosJSON) {
    return emailjs.send('service_42rjl6k', 'template_iszllup', {
        from_name: name,
        from_email: email,
        from_phone: phone,
        message: textoPlano,
        reply_to: email,
        subject: `[WOMO] Contacto: ${name}`,
        datos_json: JSON.stringify(datosJSON, null, 2)
    });
}

async function enviarConFormSubmit(name, email, phone, message, metadata) {
    const formData = new FormData();
    formData.append('nombre', name);
    formData.append('email', email);
    formData.append('telefono', phone);
    formData.append('mensaje', message);
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await fetch('https://formsubmit.co/ajax/womostd@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('Error en FormSubmit');
    }
}

function limpiarFormulario() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-celular').value = '';
    document.getElementById('contact-message').value = '';
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

document.getElementById('contact-celular').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
});

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        
        const duration = Math.random() * 10 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (modal.style.display === 'flex') closeModal();
        if (document.getElementById('contact-popup').classList.contains('active')) closeContactPopup();
        if (document.getElementById('process-popup-overlay').style.display === 'flex') closeProcessPopup();
        if (document.getElementById('chatbot-window').classList.contains('active')) closeChatbot();
    }
});

document.querySelectorAll('.modal-close, .close-btn, .chatbot-close').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('modal-close')) closeModal();
        if (this.classList.contains('close-btn')) {
            if (document.getElementById('process-popup-overlay').style.display === 'flex') {
                closeProcessPopup();
            } else if (document.getElementById('contact-popup').classList.contains('active')) {
                closeContactPopup();
            }
        }
        if (this.classList.contains('chatbot-close')) closeChatbot();
    });
});

const processPopupData = {
    time: {
        title: "Transformación de Tiempo",
        content: `
            <h2 style="color: var(--verde); margin-bottom: 0.5rem;">Transformamos horas en minutos</h2>
            <p style="color: #4B5563; margin-bottom: 1.5rem;">Ahorro de tiempo comprobado con nuestros clientes</p>
            
            <div class="process-chart">
                <div class="chart-bar" style="--height: 90%;" data-value="10h"></div>
                <div class="chart-bar" style="--height: 20%;" data-value="2h"></div>
            </div>
            
            <ul style="list-style-type: none; padding-left: 0;">
                <li style="margin-bottom: 0.8rem; position: relative; padding-left: 1.5rem;">
                    <span style="position: absolute; left: 0; color: var(--verde);">•</span> 
                    Reducción del 80% en tiempos de procesamiento
                </li>
                <li style="margin-bottom: 0.8rem; position: relative; padding-left: 1.5rem;">
                    <span style="position: absolute; left: 0; color: var(--verde);">•</span> 
                    Tareas repetitivas completadas en segundos
                </li>
            </ul>
        `
    },
    workflow: {
        title: "Flujos Inteligentes",
        content: `
            <h2 style="color: var(--azul); margin-bottom: 0.5rem;">Automatización adaptativa</h2>
            <p style="color: #4B5563; margin-bottom: 1.5rem;">Eficiencia operativa mejorada</p>
            
            <div class="process-chart">
                <div class="chart-bar" style="--height: 30%; background: linear-gradient(to top, var(--azul), #1D4ED8);" data-value="-25%"></div>
                <div class="chart-bar" style="--height: 70%; background: linear-gradient(to top, var(--azul), #1D4ED8);" data-value="+30%"></div>
                <div class="chart-bar" style="--height: 45%; background: linear-gradient(to top, var(--azul), #1D4ED8);" data-value="+15%"></div>
            </div>
            
            <ul style="list-style-type: none; padding-left: 0;">
                <li style="margin-bottom: 0.8rem; position: relative; padding-left: 1.5rem;">
                    <span style="position: absolute; left: 0; color: var(--azul);">•</span> 
                    Integración perfecta con tus sistemas actuales
                </li>
                <li style="margin-bottom: 0.8rem; position: relative; padding-left: 1.5rem;">
                    <span style="position: absolute; left: 0; color: var(--azul);">•</span> 
                    Adaptable a cambios en tus procesos
                </li>
            </ul>
        `
    },
    profit: {
        title: "Impulso Rentable",
        content: `
            <h2 style="color: var(--morado); margin-bottom: 0.5rem;">Maximiza tus ganancias</h2>
            <p style="color: #4B5563; margin-bottom: 1.5rem;">Resultados financieros típicos</p>
            
            <div class="process-chart">
                <div class="chart-bar" style="--height: 60%; background: linear-gradient(to top, var(--morado), #6D28D9);" data-value="+60%"></div>
                <div class="chart-bar" style="--height: 40%; background: linear-gradient(to top, var(--morado), #6D28D9);" data-value="-40%"></div>
            </div>
            
            <ul style="list-style-type: none; padding-left: 0;">
                <li style="margin-bottom: 0.8rem; position: relative; padding-left: 1.5rem;">
                    <span style="position: absolute; left: 0; color: var(--morado);">•</span> 
                    Aumento promedio del 60% en margen de beneficio
                </li>
                <li style="margin-bottom: 0.8rem; position: relative; padding-left: 1.5rem;">
                    <span style="position: absolute; left: 0; color: var(--morado);">•</span> 
                    Reducción del 40% en costos operativos
                </li>
            </ul>
        `
    },
    analytics: {
        title: "Análisis Predictivo",
        content: `
            <h2 style="color: var(--naranja); margin-bottom: 0.5rem;">Anticipa tendencias</h2>
            <p style="color: #4B5563; margin-bottom: 1.5rem;">Toma decisiones basadas en datos</p>
            
            <div class="process-chart">
                <div class="chart-bar" style="--height: 85%; background: linear-gradient(to top, var(--naranja), #D97706);" data-value="85%"></div>
                <div class="chart-bar" style="--height: 55%; background: linear-gradient(to top, var(--naranja), #D97706);" data-value="55%"></div>
            </div>
            
            <ul style="list-style-type: none; padding-left: 0;">
                <li style="margin-bottom: 0.8rem; position: relative; padding-left: 1.5rem;">
                    <span style="position: absolute; left: 0; color: var(--naranja);">•</span> 
                    85% de precisión en pronósticos
                </li>
                <li style="margin-bottom: 0.8rem; position: relative; padding-left: 1.5rem;">
                    <span style="position: absolute; left: 0; color: var(--naranja);">•</span> 
                    55% más rápido en detectar oportunidades
                </li>
            </ul>
        `
    }
};

function openProcessPopup(type) {
    if (!processPopupData[type]) return;
    
    const popup = document.getElementById('process-popup-content');
    popup.innerHTML = `
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: ${getColorByType(type)}">${processPopupData[type].title}</h2>
        ${processPopupData[type].content}
    `;
    document.getElementById('process-popup-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function getColorByType(type) {
    const colors = {
        'time': 'var(--verde)',
        'workflow': 'var(--azul)',
        'profit': 'var(--morado)',
        'analytics': 'var(--naranja)'
    };
    return colors[type] || 'var(--gris-oscuro)';
}

function closeProcessPopup() {
    document.getElementById('process-popup-overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Configuración avanzada del Chatbot
const chatbotConfig = {
    greetings: [
        "¡Hola! Soy WoMi, tu asistente en automatización inteligente. 😊",
        "¿Sabías que podemos ahorrarte hasta 20 horas semanales? ⏱️ Cuéntame, ¿qué desafíos enfrentas en tu negocio?",
        "¡Hola! 👋 En WoMo Studio transformamos procesos manuales en sistemas automatizados. ¿En qué puedo ayudarte hoy?"
    ],
    responses: {
        "hola": {
            messages: [
                "¡Hola! 👋",
                "Soy WoMi, tu asistente en automatización inteligente de WoMo Studio.",
                "Estoy aquí para mostrarte cómo podemos:",
                "• ⏱️ Ahorrarte hasta 20 horas semanales",
                "• 💰 Reducir tus costos operativos en un 40%",
                "• 📈 Aumentar tu productividad en un 60%",
                "¿Qué área de tu negocio te gustaría optimizar primero?"
            ],
            quickReplies: ["Ahorro de tiempo", "Reducir costos", "Aumentar productividad", "Contactar experto"]
        },
        "servicio": {
            messages: [
                "🚀 Ofrecemos soluciones personalizadas de automatización:",
                "",
                "1. <strong>Diagnóstico Gratuito</strong>: Analizamos tus procesos sin costo",
                "",
                "2. <strong>Implementación Rápida</strong>: Resultados en menos de 2 semanas",
                "",
                "3. <strong>Soporte Continuo</strong>: Acompañamiento post-implementación",
                "",
                "¿Te gustaría agendar una llamada para conocer más detalles?"
            ],
            quickReplies: ["Sí, agendar llamada", "Ver casos de éxito", "¿Cuánto cuesta?", "Contactar ahora"]
        },
        "tiempo": {
            messages: [
                "⏱️ El tiempo es dinero, y esto es lo que logramos para nuestros clientes:",
                "",
                "• <strong>80% menos tiempo</strong> en procesos repetitivos",
                "• <strong>15-20 horas recuperadas</strong> semanalmente por empleado",
                "• <strong>Procesos completados</strong> en minutos en lugar de horas",
                "",
                "Un cliente reciente recuperó 18 horas semanales solo en gestión de facturas.",
                "",
                "¿Te gustaría que te muestre cómo podríamos hacerlo en tu negocio?"
            ],
            quickReplies: ["Sí, muéstrame", "¿Cómo funciona?", "Hablar con experto", "Enviar información"]
        },
        "contacto": {
            messages: [
                "📞 ¡Excelente decisión! Estamos listos para transformar tu negocio.",
                "",
                "Puedes contactarnos ahora mismo por:",
                "• WhatsApp: +57 318 0401930 (respuesta inmediata)",
                "• Correo: hola@womostudio.com",
                "",
                "O si prefieres, puedo programar una consultoría gratuita para ti..."
            ],
            actions: [{
                type: "button",
                text: "📝 Agendar Consultoría Gratis",
                action: "showLeadForm('consultoria')"
            }]
        },
        "precio": {
            messages: [
                "💰 Nuestros clientes típicamente ven un <strong>ROI de 3-5x</strong> en los primeros meses.",
                "",
                "Los costos varían según tus necesidades, pero para darte una idea:",
                "",
                "• <strong>Pequeñas empresas</strong>: Desde $1.5M/mes (se paga solo con los ahorros)",
                "• <strong>Empresas medianas</strong>: Soluciones completas desde $5M/mes",
                "",
                "Lo mejor es que primero analicemos tus procesos específicos en una consultoría gratuita.",
                "",
                "¿Te gustaría agendar una llamada sin compromiso?"
            ],
            quickReplies: ["Sí, agendar", "Ver demo", "Más información", "WhatsApp"]
        },
        "gracias": {
            messages: [
                "¡El placer es nuestro! 😊",
                "Recuerda que en WoMo Studio estamos para ayudarte a crecer mediante la automatización inteligente.",
                "Si necesitas algo más, aquí estaré."
            ],
            quickReplies: ["Más información", "Ver servicios", "Contactar asesor"]
        },
        "adios": {
            messages: [
                "¡Fue un gusto ayudarte! ⚡",
                "No olvides que podemos transformar tus desafíos operativos en ventajas competitivas.",
                "¡Que tengas un excelente día!"
            ],
            quickReplies: []
        },
        "default": {
            messages: [
                "¡Buena pregunta! Permíteme explicarte cómo podemos ayudarte:",
                "",
                "En WoMo Studio nos especializamos en identificar cuellos de botella y convertirlos en procesos automatizados eficientes.",
                "",
                "¿Qué es lo que más te preocupa en tus operaciones actuales?"
            ],
            quickReplies: ["Procesos lentos", "Errores frecuentes", "Falta de visibilidad", "Hablar con experto"]
        }
    },
    leadForms: {
        "consultoria": {
            title: "Agenda tu Consultoría Gratuita",
            fields: [
                { name: "nombre", placeholder: "Tu nombre completo", type: "text", required: true },
                { name: "email", placeholder: "Email corporativo", type: "email", required: true },
                { name: "telefono", placeholder: "WhatsApp", type: "tel", required: true },
                { 
                    name: "necesidad", 
                    placeholder: "Descríbenos tu mayor desafío operativo", 
                    type: "textarea", 
                    required: false 
                }
            ],
            submitText: "Agendar Consultoría Gratis",
            successMessage: "¡Listo! Un experto se contactará contigo en menos de 24 horas para coordinar la consultoría. Mientras tanto, ¿te gustaría ver un caso similar al tuyo?"
        }
    },
    farewells: [
        "¡Gracias por conversar! Recuerda que la automatización puede ser tu mejor aliada para crecer.",
        "Fue un gusto asistirte. Cuando quieras retomar la conversación, estaré aquí.",
        "¡Hasta pronto! Si necesitas optimizar tus procesos, aquí me tienes."
    ]
};

// Variables del chatbot
let isTyping = false;
let currentLeadForm = null;

// Funciones principales del chatbot
function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotIcon = document.querySelector('.chatbot-icon');
    
    if (chatbotWindow.classList.contains('active')) {
        closeChatbot();
    } else {
        openChatbot();
    }
}

function openChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotIcon = document.querySelector('.chatbot-icon');
    
    if (isPopupActive) {
        hideInactivityPopup();
    }
    
    chatbotWindow.classList.add('active');
    chatbotIcon.style.display = 'none';
    
    if (document.getElementById('chatbot-messages').children.length === 0) {
        showInitialGreeting();
    }
    
    resetInactivityTimer();
}

function closeChatbot() {
    document.getElementById('chatbot-window').classList.remove('active');
    document.querySelector('.chatbot-icon').style.display = 'flex';
}

function showInitialGreeting() {
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        const randomGreeting = chatbotConfig.greetings[Math.floor(Math.random() * chatbotConfig.greetings.length)];
        addBotMessage(randomGreeting);
        showQuickReplies(chatbotConfig.responses["hola"].quickReplies);
    }, 1500);
}

function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.innerHTML += `
        <div class="message user-message">${text}</div>
    `;
    scrollToBottom();
    
    setTimeout(() => {
        processUserInput(text);
    }, 500);
}

function addBotMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    
    paragraphs.forEach(paragraph => {
        if (paragraph.trim() !== '') {
            messagesContainer.innerHTML += `
                <div class="message bot-message">${paragraph}</div>
            `;
        }
    });
    
    scrollToBottom();
}

function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.innerHTML += `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    scrollToBottom();
}

function removeTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function showQuickReplies(options) {
    const quickOptionsContainer = document.getElementById('quick-options');
    quickOptionsContainer.innerHTML = options.map(option => `
        <div class="quick-option" onclick="handleQuickReply('${option}')">${option}</div>
    `).join('');
}

function handleQuickReply(option) {
    addUserMessage(option);
}

function processUserInput(input) {
    showTypingIndicator();
    document.getElementById('quick-options').innerHTML = '';
    
    setTimeout(() => {
        removeTypingIndicator();
        
        const lowerInput = input.toLowerCase();
        let responseFound = false;
        
        // Verificar palabras clave
        if (lowerInput.includes('gracias') || lowerInput.includes('thank')) {
            const randomResponse = chatbotConfig.responses["gracias"].messages;
            randomResponse.forEach(msg => addBotMessage(msg));
            showQuickReplies(chatbotConfig.responses["gracias"].quickReplies);
            responseFound = true;
        }
        else if (lowerInput.includes('adios') || lowerInput.includes('hasta luego') || lowerInput.includes('bye')) {
            const randomFarewell = chatbotConfig.farewells[Math.floor(Math.random() * chatbotConfig.farewells.length)];
            addBotMessage(randomFarewell);
            responseFound = true;
        }
        else if (lowerInput.includes('hola') || lowerInput.includes('hi')) {
            const response = chatbotConfig.responses["hola"];
            response.messages.forEach(msg => addBotMessage(msg));
            showQuickReplies(response.quickReplies);
            responseFound = true;
        }
        else if (lowerInput.includes('servicio') || lowerInput.includes('qué hacen') || lowerInput.includes('que ofrecen')) {
            const response = chatbotConfig.responses["servicio"];
            response.messages.forEach(msg => addBotMessage(msg));
            if (response.quickReplies) showQuickReplies(response.quickReplies);
            responseFound = true;
        }
        else if (lowerInput.includes('tiempo') || lowerInput.includes('rápido') || lowerInput.includes('lento')) {
            const response = chatbotConfig.responses["tiempo"];
            response.messages.forEach(msg => addBotMessage(msg));
            if (response.quickReplies) showQuickReplies(response.quickReplies);
            responseFound = true;
        }
        else if (lowerInput.includes('contacto') || lowerInput.includes('hablar') || lowerInput.includes('llamar')) {
            const response = chatbotConfig.responses["contacto"];
            response.messages.forEach(msg => addBotMessage(msg));
            if (response.actions) {
                response.actions.forEach(action => {
                    if (action.type === "button") {
                        setTimeout(() => {
                            eval(action.action);
                        }, 500);
                    }
                });
            }
            responseFound = true;
        }
        else if (lowerInput.includes('precio') || lowerInput.includes('costo') || lowerInput.includes('cuánto cuesta')) {
            const response = chatbotConfig.responses["precio"];
            response.messages.forEach(msg => addBotMessage(msg));
            if (response.quickReplies) showQuickReplies(response.quickReplies);
            responseFound = true;
        }
        
        // Respuesta por defecto si no se encontró coincidencia
        if (!responseFound) {
            chatbotConfig.responses.default.messages.forEach(msg => addBotMessage(msg));
            if (chatbotConfig.responses.default.quickReplies) {
                showQuickReplies(chatbotConfig.responses.default.quickReplies);
            }
        }
    }, 1000 + Math.random() * 1000);
}

function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (message) {
        addUserMessage(message);
        input.value = '';
    }
    
    input.focus();
}

function showLeadForm(formType) {
    const formConfig = chatbotConfig.leadForms[formType];
    if (!formConfig) return;
    
    currentLeadForm = formType;
    
    const messagesContainer = document.getElementById('chatbot-messages');
    let formHTML = `
        <div class="lead-form" id="lead-form">
            <h4>${formConfig.title}</h4>
    `;
    
    formConfig.fields.forEach(field => {
        if (field.type === 'textarea') {
            formHTML += `
                <textarea name="${field.name}" placeholder="${field.placeholder}" 
                    ${field.required ? 'required' : ''}></textarea>
            `;
        } else {
            formHTML += `
                <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" 
                    ${field.required ? 'required' : ''}>
            `;
        }
    });
    
    formHTML += `
            <button onclick="submitLeadForm('${formType}')">${formConfig.submitText}</button>
        </div>
    `;
    
    messagesContainer.innerHTML += formHTML;
    scrollToBottom();
}

function submitLeadForm(formType) {
    const form = document.getElementById('lead-form');
    const formData = {};
    let isValid = true;
    
    chatbotConfig.leadForms[formType].fields.forEach(field => {
        if (field.required) {
            const input = form.querySelector(`[name="${field.name}"]`);
            if (!input.value.trim()) {
                input.style.borderColor = '#EF4444';
                isValid = false;
            } else {
                input.style.borderColor = '#e2e8f0';
                formData[field.name] = input.value.trim();
            }
        }
    });
    
    if (!isValid) {
        addBotMessage("Por favor completa todos los campos requeridos.");
        return;
    }
    
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        form.remove();
        
        addBotMessage(chatbotConfig.leadForms[formType].successMessage);
        
        if (formType === 'consultoria') {
            showQuickReplies(["Ver caso similar", "Cómo prepararme", "Gracias"]);
        }
        
        sendLeadDataToBackend(formData, formType);
    }, 2000);
}

function sendLeadDataToBackend(data, formType) {
    const textoPlano = `
== NUEVO LEAD DEL CHATBOT ==
Tipo: ${formType}
Nombre: ${data.nombre || 'No proporcionado'}
Email: ${data.email || 'No proporcionado'}
Teléfono: ${data.telefono || 'No proporcionado'}
Mensaje: ${data.necesidad || 'Consulta desde chatbot'}
Fecha: ${new Date().toLocaleString()}
==============================================
`;

    const datosJSON = {
        fecha: new Date().toISOString(),
        origen: "chatbot",
        tipo_formulario: formType,
        contacto: {
            nombre: data.nombre || null,
            email: data.email || null,
            telefono: data.telefono || null
        },
        mensaje: data.necesidad || 'Consulta desde chatbot',
        metadata: {
            pagina: window.location.href,
            userAgent: navigator.userAgent,
            interacciones: document.getElementById('chatbot-messages').children.length
        }
    };

    emailjs.send('service_42rjl6k', 'template_iszllup', {
        from_name: data.nombre || 'Usuario Chatbot',
        from_email: data.email || 'no-email@chatbot.com',
        from_phone: data.telefono || '',
        message: textoPlano,
        reply_to: data.email || 'womostd@gmail.com',
        subject: `[WOMO] Lead Chatbot: ${formType} - ${data.nombre || 'Anónimo'}`,
        datos_json: JSON.stringify(datosJSON, null, 2)
    })
    .then(response => {
        console.log('Correo enviado!', response.status, response.text);
    })
    .catch(error => {
        console.error('Error al enviar:', error);
        sendWithFormSubmit(data, formType);
    });
}

function sendWithFormSubmit(data, formType) {
    const datosJSON = {
        fecha: new Date().toISOString(),
        origen: "chatbot",
        tipo_formulario: formType,
        contacto: {
            nombre: data.nombre || null,
            email: data.email || null,
            telefono: data.telefono || null
        },
        mensaje: data.necesidad || 'Consulta desde chatbot',
        metadata: {
            pagina: window.location.href,
            userAgent: navigator.userAgent
        }
    };

    const formData = new FormData();
    formData.append('nombre', data.nombre || '');
    formData.append('email', data.email || '');
    formData.append('telefono', data.telefono || '');
    formData.append('mensaje', data.necesidad || 'Consulta desde chatbot');
    formData.append('metadata', JSON.stringify(datosJSON));
    formData.append('_subject', `[Chatbot] ${formType} - ${data.nombre || 'Anónimo'}`);
    
    fetch('https://formsubmit.co/ajax/womostd@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log('FormSubmit success:', data))
    .catch(error => console.error('FormSubmit error:', error));
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Configuración del asistente flotante WoMi
const inactivityConfig = {
    timeout: 15000, // 15 segundos para mostrar el popup
    messages: [
        "¿Necesitas ayuda para optimizar tus procesos?",
        "¡Hola! ¿Sabías que podemos ahorrarte hasta 20 horas semanales?",
        "¿Te gustaría saber cómo automatizar tus operaciones?",
        "Transforma tus procesos manuales en sistemas automáticos. ¿Hablamos?",
        "¡Me encantaría mostrarte cómo podemos ayudarte!"
    ],
    displayDuration: 300000, // 5 minutos visible
    cooldown: 30000, // 30 segundos antes de reaparecer
    positions: ['position-bottom-right', 'position-bottom-left']
};

let inactivityTimer;
let isPopupActive = false;
let lastInteractionTime = Date.now();
let hideTimeout;
let currentPosition = '';
let isGifWindowOpen = false;

function getRandomMessage() {
    return inactivityConfig.messages[Math.floor(Math.random() * inactivityConfig.messages.length)];
}

function getRandomPosition() {
    currentPosition = inactivityConfig.positions[Math.floor(Math.random() * inactivityConfig.positions.length)];
    return currentPosition;
}

function showInactivityPopup() {
    if (isPopupActive || isGifWindowOpen || document.getElementById('chatbot-window').classList.contains('active')) return;
    
    const popup = document.getElementById('inactivity-popup');
    const message = document.getElementById('inactivity-message');
    const gif = document.getElementById('inactivity-gif');
    
    popup.className = 'inactivity-popup ' + getRandomPosition();
    message.textContent = getRandomMessage();
    
    popup.style.display = 'flex';
    setTimeout(() => {
        popup.style.opacity = '1';
        setTimeout(() => {
            message.classList.add('active');
        }, 300);
    }, 50);
    
    gif.onclick = function(e) {
        e.stopPropagation();
        openGifWindow();
    };
    
    hideTimeout = setTimeout(() => {
        hideInactivityPopup();
    }, inactivityConfig.displayDuration);
    
    isPopupActive = true;
    document.addEventListener('click', closePopupOnOutsideClick, true);
}

function closePopupOnOutsideClick(e) {
    const popup = document.getElementById('inactivity-popup');
    const gifWindow = document.getElementById('gif-window');
    
    if (!popup.contains(e.target) && !isGifWindowOpen) {
        hideInactivityPopup();
    }
    
    if (isGifWindowOpen && !gifWindow.contains(e.target)) {
        closeGifWindow();
    }
}

function openGifWindow() {
    if (isGifWindowOpen) return;
    
    const popup = document.getElementById('inactivity-popup');
    const gifWindow = document.getElementById('gif-window');
    const gifWindowContent = document.getElementById('gif-window-content');
    
    gifWindowContent.innerHTML = `
        <div class="gif-window-header">
            <h3>¡Hola! Soy WoMi 👋</h3>
            <button class="close-gif-window">&times;</button>
        </div>
        <div class="gif-window-body">
            <p>${getRandomMessage()}</p>
            <div class="gif-window-options">
                <button class="gif-option-btn" onclick="handleGifOption('Quiero ahorrar tiempo')">Ahorrar tiempo</button>
                <button class="gif-option-btn" onclick="handleGifOption('Reducir costos')">Reducir costos</button>
                <button class="gif-option-btn" onclick="handleGifOption('Consultoría gratis')">Consultoría gratis</button>
            </div>
        </div>
    `;
    
    document.querySelector('.close-gif-window').onclick = closeGifWindow;
    positionGifWindow(popup, gifWindow);
    
    gifWindow.style.display = 'flex';
    setTimeout(() => {
        gifWindow.style.opacity = '1';
        gifWindow.style.transform = 'translateY(0)';
    }, 50);
    
    isGifWindowOpen = true;
    document.getElementById('inactivity-gif').classList.add('talking');
    clearTimeout(hideTimeout);
}

function handleGifOption(option) {
    closeGifWindow();
    openChatbot();
    addUserMessage(option);
}

function positionGifWindow(popup, gifWindow) {
    const popupRect = popup.getBoundingClientRect();
    
    if (currentPosition === 'position-bottom-right') {
        gifWindow.style.bottom = '20px';
        gifWindow.style.right = `${popupRect.width + 30}px`;
        gifWindow.style.left = 'auto';
        gifWindow.style.top = 'auto';
        gifWindow.style.transform = 'translateY(20px)';
    } else if (currentPosition === 'position-bottom-left') {
        gifWindow.style.bottom = '20px';
        gifWindow.style.left = `${popupRect.width + 30}px`;
        gifWindow.style.right = 'auto';
        gifWindow.style.top = 'auto';
        gifWindow.style.transform = 'translateY(20px)';
    }
}

function closeGifWindow() {
    if (!isGifWindowOpen) return;
    
    const gifWindow = document.getElementById('gif-window');
    const gif = document.getElementById('inactivity-gif');
    
    gifWindow.style.opacity = '0';
    gifWindow.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        gifWindow.style.display = 'none';
        isGifWindowOpen = false;
        gif.classList.remove('talking');
        
        hideTimeout = setTimeout(() => {
            hideInactivityPopup();
        }, inactivityConfig.displayDuration);
    }, 300);
}

function hideInactivityPopup() {
    if (!isPopupActive) return;
    
    const popup = document.getElementById('inactivity-popup');
    const message = document.getElementById('inactivity-message');
    const gif = document.getElementById('inactivity-gif');
    
    clearTimeout(hideTimeout);
    message.classList.remove('active');
    
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
            isPopupActive = false;
            gif.classList.remove('idle', 'talking');
            document.removeEventListener('click', closePopupOnOutsideClick, true);
            setTimeout(resetInactivityTimer, inactivityConfig.cooldown);
        }, 500);
    }, 100);
    
    if (isGifWindowOpen) {
        closeGifWindow();
    }
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    lastInteractionTime = Date.now();
    inactivityTimer = setTimeout(checkInactivity, inactivityConfig.timeout);
}

function checkInactivity() {
    const currentTime = Date.now();
    const elapsed = currentTime - lastInteractionTime;
    
    if (elapsed >= inactivityConfig.timeout && !isPopupActive && !isGifWindowOpen) {
        showInactivityPopup();
    } else {
        resetInactivityTimer();
    }
}

function setupActivityTracking() {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
        window.addEventListener(event, () => {
            lastInteractionTime = Date.now();
            if (isPopupActive && !isGifWindowOpen) {
                hideInactivityPopup();
            }
        }, { passive: true });
    });
    
    resetInactivityTimer();
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Precargar el GIF
    const gif = new Image();
    gif.src = 'WoMi1.gif';
    
    // Iniciar el seguimiento de actividad
    setupActivityTracking();
    
    // Crear elementos necesarios si no existen
    if (!document.getElementById('gif-window')) {
        const gifWindow = document.createElement('div');
        gifWindow.id = 'gif-window';
        gifWindow.innerHTML = '<div id="gif-window-content"></div>';
        document.body.appendChild(gifWindow);
    }
    
    // Configurar eventos del chatbot
    const chatbotWindow = document.getElementById('chatbot-window');
    chatbotWindow.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Evento para enviar mensaje con Enter
    document.getElementById('chatbot-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Cerrar chatbot al hacer clic en enlaces de contacto
    document.querySelectorAll('[onclick="openContactPopup()"]').forEach(link => {
        link.addEventListener('click', closeChatbot);
    });
    
    // Crear partículas para el hero
    createParticles();
});

// Configuración de navegación del menú
const menu = document.querySelector('.top-menu');
const menuLinks = document.querySelectorAll('.top-menu-link');
const sections = {
    home: { 
        element: document.querySelector('.hero-impact'), 
        link: document.querySelector('.top-menu-link[onclick="scrollToTop()"]') 
    },
    services: { 
        element: document.querySelector('#services'), 
        link: document.querySelector('.top-menu-link[href="#services"]') 
    },
    benefits: { 
        element: document.querySelector('#benefits'), 
        link: document.querySelector('.top-menu-link[href="#benefits"]') 
    },
    impact: { 
        element: document.querySelector('#antes-despues'), 
        link: document.querySelector('.top-menu-link[href="#antes-despues"]') 
    }
};

function updateMenu() {
    const scrollPos = window.scrollY + 100;
    
    menuLinks.forEach(link => link.classList.remove('active'));
    
    let activeSection = 'home';
    
    if (scrollPos > sections.services.element.offsetTop - 100) activeSection = 'services';
    if (scrollPos > sections.benefits.element.offsetTop - 100) activeSection = 'benefits';
    if (scrollPos > sections.impact.element.offsetTop - 100) activeSection = 'impact';
    
    sections[activeSection].link.classList.add('active');
    
    if (scrollPos > 100) {
        menu.classList.add('scrolled');
    } else {
        menu.classList.remove('scrolled');
    }
}

updateMenu();
window.addEventListener('scroll', updateMenu);
window.addEventListener('resize', updateMenu);

menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== 'javascript:void(0);') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});