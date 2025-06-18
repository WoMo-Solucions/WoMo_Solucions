// Inicializar EmailJS con tu Public Key
(function() {
    emailjs.init('RRR4M2sCr-NgEf8ul');
})();

// Variables para el carrusel automático
let currentSlide = 0;
let slideInterval;
const slideTimes = [3000, 9000, 6000]; // 4s, 7s, 5s
let hasCompletedCycle = false;
let autoCloseTimeout;

// Función para avanzar slides
function goToNextSlide() {
    if (hasCompletedCycle) return;
    
    // Aplicar transición suave
    document.getElementById('modal-carousel').style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    
    currentSlide = (currentSlide + 1) % 3;
    document.getElementById('modal-carousel').style.transform = `translateX(-${currentSlide * 33.333}%)`;
    
    updateSlideDots();
    
    // Al llegar al último slide
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
    autoCloseTimeout = setTimeout(closeModal, 300000); // 5 minutos
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

// Función para abrir modal
playButton.addEventListener('click', startAutoSlide);

// Al abrir el modal
function openModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    currentSlide = 0;
    document.getElementById('modal-carousel').style.transition = 'none';
    document.getElementById('modal-carousel').style.transform = 'translateX(0)';
    document.getElementById('play-button').style.display = 'flex';
    stopAutoSlide();
    
    // Reactivar transición después de un breve retraso
    setTimeout(() => {
        document.getElementById('modal-carousel').style.transition = 'transform 0.8s ease-in-out';
    }, 50);
}


// Función para cerrar modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    stopAutoSlide();
}

// Evento para cerrar al hacer clic fuera
modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
});

// Evento del botón cerrar
closeButton.addEventListener('click', closeModal);

// Evento del botón "Descubre cómo funciona"
discoverBtn.addEventListener('click', openModal);

// Evento del botón "Quiero transformar mi negocio"
transformBtn.addEventListener('click', function() {
    closeModal();
    openContactPopup();
});

// Modifica el evento del botón play
playButton.addEventListener('click', function() {
    this.style.display = 'none';
    startAutoSlide();
});

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

// Función para validar campos (solo bordes rojos)
function validarCampos() {
    let valido = true;
    const nombre = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const celular = document.getElementById('contact-celular').value.trim();
    const mensaje = document.getElementById('contact-message').value.trim();

    // Resetear bordes
    document.querySelectorAll('input, textarea').forEach(el => {
        el.style.borderColor = '#e2e8f0';
    });

    // Validar nombre (mínimo 3 caracteres)
    if (nombre.length < 3) {
        document.getElementById('contact-name').style.borderColor = '#EF4444';
        valido = false;
    }

    // Validar email (formato básico)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('contact-email').style.borderColor = '#EF4444';
        valido = false;
    }

    // Validar celular (10 dígitos)
    if (!/^\d{10}$/.test(celular)) {
        document.getElementById('contact-celular').style.borderColor = '#EF4444';
        valido = false;
    }

    // Validar mensaje (mínimo 10 caracteres)
    if (mensaje.length < 10) {
        document.getElementById('contact-message').style.borderColor = '#EF4444';
        valido = false;
    }

    return valido;
}

// Función para enviar el formulario
async function sendContactRequest() {
    // Validar campos primero
    if (!validarCampos()) {
        mostrarNotificacion('Por favor complete todos los campos correctamente', 'error');
        return;
    }

    // Obtener valores del formulario
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const celular = document.getElementById('contact-celular').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Crear contenido para el correo
    const textoPlano = crearTextoPlano(name, email, celular, message);
    const datosJSON = crearDatosJSON(name, email, celular, message);

    try {
        // Intento principal con EmailJS
        await enviarConEmailJS(name, email, celular, textoPlano, datosJSON);
        mostrarNotificacion('¡Mensaje enviado con éxito!', 'success');
    } catch (error) {
        console.error('Error con EmailJS:', error);
        mostrarNotificacion('Usando método alternativo...', 'warning');
        
        try {
            // Intento con FormSubmit como respaldo
            await enviarConFormSubmit(name, email, celular, message, datosJSON);
            mostrarNotificacion('¡Mensaje enviado por método alternativo!', 'success');
        } catch (backupError) {
            console.error('Error con método alternativo:', backupError);
            mostrarNotificacion('Error: Por favor contáctenos por WhatsApp', 'error');
            return;
        }
    }

    // Limpiar y cerrar si todo fue bien
    limpiarFormulario();
    closeContactPopup();
}

// Función para crear texto plano
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

// Función para crear JSON estructurado
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

// Función para enviar con EmailJS
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

// Función para enviar con FormSubmit (backup)
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

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-celular').value = '';
    document.getElementById('contact-message').value = '';
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Autoformatear teléfono (solo números, máximo 10 dígitos)
document.getElementById('contact-celular').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
});

// Animación de partículas
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

// Cerrar con tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (modal.style.display === 'flex') closeModal();
        if (document.getElementById('contact-popup').classList.contains('active')) closeContactPopup();
        if (document.getElementById('process-popup-overlay').style.display === 'flex') closeProcessPopup();
        if (document.getElementById('chatbot-window').classList.contains('active')) closeChatbot();
    }
});

// Asegurar que todos los close buttons funcionen
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

// Datos para los popups de procesos
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

// Funciones para controlar los popups de procesos
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
        "¡Hola! Soy tu asistente de WoMi de Womo Studio. 😊",
        "Estoy aquí para mostrarte cómo podemos revolucionar tu negocio con automatización inteligente. ⚡",
        "Dime, ¿qué desafíos enfrentas en tus operaciones diarias?"
    ],
    responses: {
        "hola": {
            messages: [
                "¡Hola! 👋",
                "Soy tú asistente virtual WoMi, especializado en transformar negocios con automatización.",
                "Puedo asesorarte en:",
                "• 💡 Soluciones personalizadas",
                "• ⏱️ Ahorro de tiempo comprobado",
                "• 📈 Incremento en productividad",
                "¿Qué desafío de tu negocio quieres resolver con automatización?"
            ],
            quickReplies: ["Servicios", "Ahorro de tiempo", "Casos de éxito", "Contacto"]
        },
        "servicio": {
            messages: [
                "🚀 Nuestros servicios van más allá de lo básico:",
                "",
                "1. <strong>Automatización Integral</strong>: Transformamos tus procesos manuales en sistemas inteligentes que trabajan 24/7",
                "",
                "2. <strong>Flujos de Trabajo Adaptativos</strong>: Soluciones que aprenden y se ajustan a tus necesidades cambiantes",
                "",
                "3. <strong>Análisis Predictivo</strong>: Anticipamos problemas antes de que ocurran y optimizamos tus operaciones",
                "",
                "¿Te gustaría que te cuente más sobre alguno en específico?"
            ],
            quickReplies: ["Automatización Integral", "Flujos Adaptativos", "Análisis Predictivo", "Casos reales"]
        },
        "tiempo": {
            messages: [
                "⏱️ El tiempo es tu activo más valioso, y esto es lo que logramos para nuestros clientes:",
                "",
                "• <strong>Reducción del 60-80%</strong> en tiempos de procesamiento",
                "• <strong>Eliminación del 95%</strong> de errores humanos",
                "• <strong>Recuperación de 15-20 horas</strong> semanales por empleado",
                "",
                "Imagina lo que podrías hacer con todo ese tiempo extra...",
                "",
                "¿Te gustaría que te comparta un ejemplo concreto de cómo lo hemos logrado?"
            ],
            quickReplies: ["Sí, muéstrame", "Cómo funciona", "Contactar asesor"]
        },
        "contacto": {
            messages: [
                "📞 ¡Excelente decisión! Estamos listos para transformar tu negocio.",
                "",
                "Puedes contactarnos por:",
                "• WhatsApp: +57 318 0401930 (respuesta inmediata)",
                "• Correo: hola@womostudio.com",
                "",
                "O si prefieres, puedo generarte una consultoría gratuita ahora mismo..."
            ],
            actions: [{
                type: "button",
                text: "📝 Solicitar Consultoría Gratis",
                action: "showLeadForm('consultoria')"
            }]
        },
        "precio": {
            messages: [
                "💰 Nuestros clientes típicamente ven un <strong>ROI de 3-5x</strong> en los primeros 6 meses.",
                "",
                "Los costos varían según la complejidad, pero para darte una idea:",
                "",
                "• <strong>Paquete Básico</strong>: Desde $1.5M/mes (ahorros típicos de $3M+)",
                "• <strong>Paquete Empresarial</strong>: Soluciones completas desde $5M/mes",
                "",
                "Lo más valioso es que <strong>no es un gasto, es una inversión</strong> que se paga sola con los ahorros generados.",
                "",
                "¿Te gustaría que te prepare una estimación personalizada sin compromiso?"
            ],
            quickReplies: ["Sí, estimación", "Cómo empezar", "Ver demo"]
        },
        "gracias": {
            messages: [
                "¡Es un placer atenderte! 😊",
                "Recuerda que en Womo Studio estamos para optimizar y mejorar tu negocio con soluciones inteligentes.",
                "Si necesitas algo más, no dudes en preguntar. ¡Estamos aquí para ayudarte!"
            ],
            quickReplies: ["Más información", "Ver servicios", "Contactar asesor"]
        },
        "adios": {
            messages: [
                "¡Ha sido un gusto ayudarte! ⚡",
                "No olvides que podemos transformar tus desafíos operativos en ventajas competitivas.",
                "¡Que tengas un excelente día y hasta pronto!"
            ],
            quickReplies: []
        },
        "chao": {
            messages: [
                "¡Hasta luego! 👋",
                "Recuerda que nuestra misión es hacer crecer tu negocio mediante la automatización inteligente.",
                "Cuando quieras retomar la conversación, estaré aquí."
            ],
            quickReplies: []
        },
        "default": {
            messages: [
                "Interesante pregunta... Permíteme explicarte cómo WoMo Studio puede ayudarte:",
                "",
                "Somos especialistas en identificar cuellos de botella en operaciones y convertirlos en procesos automatizados eficientes.",
                "",
                "¿Qué es lo que más te preocupa en tus operaciones actuales?"
            ],
            quickReplies: ["Procesos lentos", "Muchos errores", "Falta de visibilidad", "Contactar experto"]
        }
    },
    leadForms: {
        "consultoria": {
            title: "Consultoría Gratuita",
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
            submitText: "Solicitar Consultoría",
            successMessage: "¡Listo! Un experto se contactará contigo en menos de 2 horas. Mientras tanto, ¿te gustaría ver un caso similar al tuyo?"
        }
    },
    farewells: [
        "¡Fue un placer ayudarte! Recuerda que en WoMo Studio transformamos desafíos en soluciones.",
        "Si necesitas algo más, estaré aquí. ¡Que tengas un día productivo! ⚡",
        "¡Gracias por conversar conmigo! Estamos comprometidos con el éxito de tu negocio.",
        "Fue un gusto asistirte. No dudes en volver cuando necesites optimizar tus procesos.",
        "¡Hasta pronto! Recuerda que la automatización puede ser tu mejor aliada para crecer."
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
        chatbotWindow.classList.remove('active');
        chatbotIcon.style.display = 'flex';
    } else {
        chatbotWindow.classList.add('active');
        chatbotIcon.style.display = 'none';
        
        // Mostrar mensaje inicial si es la primera vez
        if (document.getElementById('chatbot-messages').children.length === 0) {
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                const randomGreeting = chatbotConfig.greetings[Math.floor(Math.random() * chatbotConfig.greetings.length)];
                addBotMessage(randomGreeting);
                showQuickReplies(chatbotConfig.responses["hola"].quickReplies);
            }, 1500);
        }
    }
}

function closeChatbot() {
    document.getElementById('chatbot-window').classList.remove('active');
    document.querySelector('.chatbot-icon').style.display = 'flex';
}

function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.innerHTML += `
        <div class="message user-message">${text}</div>
    `;
    scrollToBottom();
    
    // Procesar después de un pequeño retraso para mejor experiencia
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
    
    // Limpiar opciones rápidas mientras procesamos
    document.getElementById('quick-options').innerHTML = '';
    
    setTimeout(() => {
        removeTypingIndicator();
        
        const lowerInput = input.toLowerCase();
        let responseFound = false;
        
        // Primero verificar palabras clave de despedida
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
        else if (lowerInput.includes('chao') || lowerInput.includes('nos vemos')) {
            const randomResponse = chatbotConfig.responses["chao"].messages;
            randomResponse.forEach(msg => addBotMessage(msg));
            responseFound = true;
        }
        
        // Si no es una despedida, buscar otras respuestas
        if (!responseFound) {
            for (const [key, response] of Object.entries(chatbotConfig.responses)) {
                if (lowerInput.includes(key.toLowerCase()) && key !== "gracias" && key !== "adios" && key !== "chao") {
                    response.messages.forEach(msg => addBotMessage(msg));
                    
                    if (response.quickReplies) {
                        showQuickReplies(response.quickReplies);
                    }
                    
                    if (response.actions) {
                        response.actions.forEach(action => {
                            if (action.type === "button") {
                                setTimeout(() => {
                                    eval(action.action); // Ejecutar la acción asociada
                                }, 500);
                            }
                        });
                    }
                    
                    responseFound = true;
                    break;
                }
            }
        }
        
        // Respuesta por defecto si no se encontró coincidencia
        if (!responseFound) {
            chatbotConfig.responses.default.messages.forEach(msg => addBotMessage(msg));
            if (chatbotConfig.responses.default.quickReplies) {
                showQuickReplies(chatbotConfig.responses.default.quickReplies);
            }
        }
    }, 1000 + Math.random() * 1000); // Retraso variable para parecer más natural
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
    
    // Validar campos requeridos
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
    
    // Simular envío (en producción aquí iría el envío real)
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        form.remove();
        
        // Mostrar mensaje de éxito
        addBotMessage(chatbotConfig.leadForms[formType].successMessage);
        
        // Mostrar opciones relevantes después del formulario
        if (formType === 'consultoria') {
            showQuickReplies(["Ver caso similar", "Cómo prepararme", "Gracias"]);
        }
        
        // Enviar los datos del lead
        sendLeadDataToBackend(formData, formType);
    }, 2000);
}

function sendLeadDataToBackend(data, formType) {
    // Crear contenido estructurado similar al formulario de contacto
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

    // Enviar con EmailJS usando el mismo formato que el formulario de contacto
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
        // En caso de error, usar FormSubmit como respaldo
        sendWithFormSubmit(data, formType);
    });
}

function sendWithFormSubmit(data, formType) {
    // Crear el mismo formato estructurado para el respaldo
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

// Event listeners
document.getElementById('chatbot-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Cerrar chatbot al hacer clic en enlaces de contacto
document.querySelectorAll('[onclick="openContactPopup()"]').forEach(link => {
    link.addEventListener('click', closeChatbot);
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Mostrar modal explicativo siempre al cargar
    openModal();
    
    // Precargar imagen del chatbot para mejor experiencia
    const img = new Image();
    img.src = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png';
    
    // Configurar navegación del menú
    const menu = document.querySelector('.top-menu');
    const menuLinks = document.querySelectorAll('.top-menu-link');
    const sections = {
        home: { element: document.querySelector('.hero-impact'), link: document.querySelector('.top-menu-link[href="#"]') },
        services: { element: document.querySelector('#services'), link: document.querySelector('.top-menu-link[href="#services"]') },
        benefits: { element: document.querySelector('#benefits'), link: document.querySelector('.top-menu-link[href="#benefits"]') },
        impact: { element: document.querySelector('#antes-despues'), link: document.querySelector('.top-menu-link[href="#antes-despues"]') }
    };

    function updateMenu() {
        const scrollPos = window.scrollY;
        
        // Reset all active states
        menuLinks.forEach(link => link.classList.remove('active'));
        
        // Determinar sección activa
        let activeSection = 'home';
        
        if (scrollPos > sections.services.element.offsetTop - 100) activeSection = 'services';
        if (scrollPos > sections.benefits.element.offsetTop - 100) activeSection = 'benefits';
        if (scrollPos > sections.impact.element.offsetTop - 100) activeSection = 'impact';
        
        // Aplicar estado activo
        sections[activeSection].link.classList.add('active');
        
        // Cambiar color del menú al hacer scroll
        if (scrollPos > 100) {
            menu.classList.add('scrolled');
        } else {
            menu.classList.remove('scrolled');
        }
    }

    // Inicialización
    updateMenu();
    window.addEventListener('scroll', updateMenu);
    window.addEventListener('resize', updateMenu);

    // Smooth scroll
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
});