// chatbot-database.js - Base de datos conversacional limpia
const chatbotDatabase = {
    // 20 saludos iniciales con enfoque de descubrimiento
    greetings: [
        "¡Hola! Soy WoMi, tu asistente de automatización 🤖 ¿Qué tarea repetitiva te gustaría eliminar hoy?",
        "¡Buen día! 🌟 WoMo Studio aquí. ¿Cuántos sistemas revisas para encontrar información clave?",
        "¡Hola! Detecto que buscas eficiencia. ¿Qué proceso se ha complicado con tu crecimiento?",
        "¡Hola humano! 👋 ¿Cómo aseguran que lo que pide el cliente se ejecute correctamente?",
        "¡Bienvenido! ¿Cómo mantienen alineadas sus múltiples ubicaciones operativas?",
        "¡Saludos! Soy WoMi. ¿Qué proceso manual consume más tiempo de tu equipo?",
        "¡Hola! La eficiencia comienza aquí. ¿Qué flujo te gustaría optimizar primero?",
        "¡Buen día! Automatización es mi especialidad. ¿Qué datos suelen perderse en tu operación?",
        "¡Hola innovador! 🚀 ¿Tus clientes reciben información inconsistente a veces?",
        "¡Hola! Noto que buscas mejorar. ¿Qué área es prioritaria para optimizar?",
        "¡Bienvenido a la automatización! ¿Prefieres comenzar con un módulo específico?",
        "¡Hola visionario! ¿Qué necesitarías ver para tomar decisión esta semana?",
        "¡Saludos! ¿Si el costo no fuera impedimento, qué proceso automatizarías hoy?",
        "¡Hola! ¿Cómo manejan actualmente la comunicación entre departamentos?",
        "¡Buen día! ¿Qué documentos te gustaría migrar a digital primero?",
        "¡Hola! ¿Qué reportes te toman demasiado tiempo generar manualmente?",
        "¡Bienvenido! ¿Qué proceso se ha vuelto un cuello de botella para ti?",
        "¡Hola! ¿Qué métricas te gustaría tener accesibles en un dashboard?",
        "¡Saludos! ¿Qué tarea de tu equipo podría ser 100% automática?",
        "¡Hola! ¿En qué área sientes que pierdes más tiempo actualmente?"
    ],

    // 15 introducciones a procesos repetitivos (versión limpia)
    repetitiveProcesses: {
        intro: [
            "🔍 Los procesos repetitivos son nuestra especialidad. Imagina recuperar esas horas perdidas...",
            "¡Justo esto automatizamos mejor! La mayoría de estas tareas pueden ser automáticas.",
            "Ah, los procesos repetitivos... el gran enemigo de la productividad. Podemos ayudarte.",
            "Automatizar lo repetitivo es como ganar tiempo extra cada día. ¿Listo para comenzar?",
            "Los procesos manuales repetitivos son candidatos perfectos para la automatización.",
            "¡Transformamos lo repetitivo en automático! Tu equipo te lo agradecerá.",
            "La automatización nació para liberarte de estas tareas. ¿Quieres saber cómo?",
            "Nada me gusta más que eliminar procesos repetitivos. Es mi especialidad.",
            "Los procesos repetitivos son como arena en los engranajes. ¡Limpiémoslos juntos!",
            "Automatizar lo repetitivo es el primer paso hacia operaciones escalables.",
            "Cada proceso repetitivo que eliminamos es una victoria para tu productividad.",
            "¿Sabías que tu equipo valora más liberarse de tareas repetitivas que casi cualquier beneficio?",
            "Los procesos repetitivos consumen recursos sin agregar valor. Cambiemos eso.",
            "Automatizar lo repetitivo es como poner tu negocio en piloto automático.",
            "Nuestros clientes aman cómo transformamos sus procesos. Tú podrías ser el próximo."
        ],
        benefits: [
            "Los beneficios inmediatos que verás:",
            "Esto es lo que lograrás:",
            "Los cambios más impactantes:",
            "Ventajas clave:",
            "Resultados rápidos:",
            "Mejoras notables:",
            "Beneficios principales:",
            "Impacto positivo:",
            "Cambios visibles:",
            "Lo que ganarás:",
            "Frutas de automatizar:",
            "Resultados valiosos:",
            "Transformaciones clave:",
            "Efectos positivos:",
            "Recompensas:"
        ]
    },

    // 20 transiciones a contacto (versión limpia)
    contactTransitions: [
        "Para personalizar esto, ¿qué te parece comenzar con un piloto en tu área más crítica?",
        "Este desafío lo resolvemos mejor en una consultoría personalizada. ¿Te interesa?",
        "La mejor manera de avanzar es con una demostración concreta. ¿Quieres ver cómo sería?",
        "Nuestro equipo tiene experiencia específica en esto. ¿Qué necesitas para decidir?",
        "Para una solución exacta, podríamos empezar por un módulo prioritario. ¿Cuál eliges?",
        "La magia ocurre al adaptarnos a ti. ¿Si no hubiera impedimentos, avanzarías?",
        "Tengo un experto disponible. ¿Prefieres información detallada primero?",
        "El siguiente paso sería una conversación técnica. ¿Te parece?",
        "Para calcular tu ROI exacto, necesitaríamos una breve llamada. ¿La agendamos?",
        "Clientes exitosos comenzaron con una simple conversación. ¿Quieres continuar?",
        "La implementación perfecta empieza entendiéndote. ¿Podemos reconectar luego si ahora no es momento?",
        "Un especialista puede darte más detalles. ¿Quieres que te conecte?",
        "Para una propuesta concreta, ¿qué información adicional necesitarías?",
        "La transformación comienza con un diagnóstico. ¿Te interesa?",
        "Nuestro mejor trabajo surge de entenderte. ¿Qué objeción te detiene hoy?",
        "Para mostrarte exactamente cómo sería, ¿prefieres demo o documentación?",
        "Los detalles los afinamos juntos. ¿Hablamos con nuestro equipo técnico?",
        "La solución ideal emerge al conocer tus procesos. ¿Nos permites evaluar?",
        "Para ajustar perfectamente, ¿qué pregunta no te he hecho que sería importante?",
        "El camino más rápido es con una evaluación inicial. ¿Qué opinas?"
    ],

    // 30 respuestas genéricas positivas (versión limpia)
    genericResponses: {
        positive: [
            "¡Excelente enfoque! 👏 Esto puede transformarse en proceso automático fácilmente.",
            "Me encanta tu actitud proactiva 💪 Podemos empezar con un módulo específico.",
            "¡Mentalidad ganadora! 🏆 Nuestro equipo tiene amplia experiencia en esto.",
            "¡Magnífica decisión! 🌟 ¿Quieres que te enviemos más detalles?",
            "¡Así se hace! 🚀 ¿Qué necesitarías para decidir esta semana?",
            "¡Perfecto! 💡 Si no hubiera impedimentos, ¿qué área automatizarías?",
            "¡Fantástico! ✨ Podemos reconectar cuando sea mejor momento.",
            "¡Brillante! 🌈 ¿Qué proceso te quita más sueño actualmente?",
            "¡Entusiasmo contagioso! 😊 ¿Prefieres demo o hablar con nuestro equipo?",
            "¡Verdadero emprendedor! 🧠 ¿Cómo manejan esto actualmente?",
            "¡Respuesta perfecta! 👍 ¿Te parece empezar con un piloto?",
            "¡Así me gusta! 💼 ¿Cuántos sistemas usas para información clave?",
            "¡Maravilloso! 🌻 ¿Qué se ha complicado con tu crecimiento?",
            "¡Impresionante! 🤩 ¿Cómo alinean sus ubicaciones actualmente?",
            "¡Correcto! ✔️ ¿Te conecto con nuestro experto?"
        ],
        neutral: [
            "Entiendo perfectamente. La automatización funciona mejor en su momento.",
            "No hay prisa. Podemos reconectar cuando sea mejor para ti.",
            "Comprendo. Si no hubiera impedimentos, ¿considerarías avanzar?",
            "Todo a su tiempo. ¿Quieres que te enviemos información?",
            "Respetable decisión. ¿Prefieres comenzar con algo pequeño?",
            "Entendido. ¿Qué información necesitarías para el futuro?",
            "Claro. La tecnología debe adaptarse a tus tiempos.",
            "Comprendo. ¿Te gustaría recibir updates periódicos?",
            "Perfecto. ¿Qué cambiaría para que esto sea prioritario?",
            "Entiendo. ¿Agendamos recordatorio para reconectar?",
            "No hay problema. ¿Otra área que quieras optimizar?",
            "Comprendo tu postura. ¿Algún proceso menor para mejorar?",
            "Claro. ¿Te interesarían tips de automatización?",
            "Entendido. ¿Qué objeción sería clave resolver?",
            "Respeto tu posición. ¿Dejamos puerta abierta?"
        ],
        redirect: [
            "Para mejor orientación, ¿te gustaría ver cómo funciona?",
            "Esto merece atención personalizada. ¿Prefieres demo?",
            "La mejor manera es con ejemplo concreto. ¿Te interesa?",
            "Para respuestas precisas, ¿hablamos con un experto?",
            "Este nivel de detalle lo maneja mejor nuestro equipo.",
            "Para aclarar dudas, ¿prefieres comenzar con piloto?",
            "Estas consultas las responde mejor nuestro técnico.",
            "Para asesoría completa, ¿hablamos con implementador?",
            "La información más exacta la da nuestro equipo.",
            "Para asegurarnos de ayudarte, ¿qué pregunta falta?"
        ]
    },

    // 15 despedidas (versión limpia)
    goodbyes: [
        "¡Fue un gusto ayudarte! Podemos empezar pequeño cuando estés listo.",
        "Hasta pronto. Si decides avanzar, aquí estaremos.",
        "¡Gracias por conversar! Cuando el momento sea ideal, volvemos.",
        "Fue un placer. ¿Reconectamos en otro momento?",
        "¡Hasta luego! La solución ideal emerge al conocerte mejor.",
        "Gracias. Pequeños pilotos pueden ser gran inicio.",
        "¡Adiós por ahora! Si necesitas ver cómo sería, aquí estoy.",
        "Fue un gusto. ¿Qué cambiaría para avanzar?",
        "¡Nos vemos! Cuando quieras continuar, sabrás dónde.",
        "Gracias por tu tiempo. Puede comenzar por un área.",
        "¡Hasta la próxima! Los beneficios suelen verse rápido.",
        "Fue un placer. Si surge alguna duda, aquí estoy.",
        "¡Adiós! Toda gran automatización comienza con conversación.",
        "Gracias. ¿Agendamos recordatorio para reconectar?",
        "¡Hasta pronto! Cuando estés listo, aquí estaremos."
    ],

    // Función para obtener respuesta aleatoria
    getRandom: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};

// Exportación
if (typeof module !== 'undefined' && module.exports) {
    module.exports = chatbotDatabase;
} else {
    window.chatbotDatabase = chatbotDatabase;
}