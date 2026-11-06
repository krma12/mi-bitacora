// =========================================================
// MEMORIAS · los álbumes (los usan memorias.html y el adelanto de index.html)
//
// Para agregar un álbum:
//   1. Crea la carpeta img/memorias/<nombre>/ con las fotos 1.jpg, 2.jpg, 3.jpg…
//      (sin metadatos: la revisión automática rechaza fotos con GPS)
//   2. Copia un bloque { … } de abajo y cambia sus datos:
//      - "id": nombre corto sin espacios (se usa en el link: memorias.html#id)
//      - "fecha": AAAA-MM-DD (ordena los álbumes y arma el filtro por año)
//      - "texto_es" / "texto_en": un párrafo por cada elemento de la lista
//      - "pies_es" / "pies_en": un pie por foto, en el mismo orden (1.jpg, 2.jpg…)
//      - "cita": opcional; bórrala si el álbum no lleva cita
//   3. Ojo: es formato JSON. Comillas dobles, y sin coma después del último elemento.
// =========================================================
window.MEMORIAS = [
    {
        "id": "primera-sutura",
        "fecha": "2018-09-19",
        "fecha_es": "19 de septiembre de 2018 · 9:26 pm",
        "fecha_en": "September 19, 2018 · 9:26 pm",
        "titulo_es": "Mi primera sutura",
        "titulo_en": "My first stitches",
        "texto_es": [
            "En 2018 no sabía si estudiar medicina o veterinaria, así que un amigo médico me dejó acompañarlo en su turno para ver si me gustaba. Estaba nervioso; llegaron varios pacientes, uno con una quemadura de segundo grado al que ayudé a curar, y esa noche mi amigo me enseñó a suturar por primera vez.",
            "Me gustó demasiado, pero esa noche mi percepción cambió: tratar a las personas puede ser difícil y complicado, y me di cuenta de que prefería tratar a los animales."
        ],
        "texto_en": [
            "In 2018 I wasn't sure whether to study medicine or veterinary medicine, so a doctor friend let me tag along on his shift to see if I liked it. I was nervous; several patients came in, one with a second-degree burn that I helped treat, and that night my friend taught me how to suture for the first time.",
            "I loved it, but that night my perspective changed: treating people can be hard and complicated, and I realized I'd rather treat animals."
        ],
        "carpeta": "img/memorias/momentos",
        "pies_es": [
            "Curando una quemadura",
            "Atendiendo a otro paciente",
            "Mi primera sutura",
            "Al terminar"
        ],
        "pies_en": [
            "Treating a burn",
            "Helping another patient",
            "My first stitches",
            "When we were done"
        ]
    },
    {
        "id": "tulum-2024",
        "fecha": "2024-01-26",
        "fecha_es": "26 de enero de 2024",
        "fecha_en": "January 26, 2024",
        "titulo_es": "De vuelta en Tulum",
        "titulo_en": "Back in Tulum",
        "texto_es": [
            "Era un viaje que había planeado con amigos que estaban a 4,154 km por carretera y 3,360 km en avión. En ese viaje conocí lo bello y lo agrio que puede llegar a ser un final: empezó en un club de playa llamado Martina y terminó, definitivamente, en la Quinta Avenida."
        ],
        "texto_en": [
            "It was a trip I had planned with friends who were 4,154 km away by road and 3,360 km by plane. On that trip I learned how beautiful, and how bitter, an ending can be: it began at a beach club called Martina and ended, for good, on La Quinta Avenida."
        ],
        "carpeta": "img/memorias/tulum-2024",
        "pies_es": [
            "Descansando en Tulum"
        ],
        "pies_en": [
            "Resting in Tulum"
        ],
        "cita": {
            "es": "«Empecé a bajar, tratando durante algún tiempo de no mirarla, como se evita mirar al sol; pero la veía, como se ve al sol… sin mirarla. Asombrado de tal osadía y desembarazo en presencia de ella y, aunque sin mirarla, sin perderla un segundo de vista. Tenía la sensación de que el sol se me acercaba… Y así fue.»",
            "en": "“I started down, trying for a while not to look at her, the way you avoid looking at the sun; but I saw her, the way you see the sun… without looking. Amazed at such boldness and ease in her presence and, though not looking at her, never losing sight of her for a second. I felt as if the sun were coming closer to me… And so it was.”",
            "autor_es": "Lev Tolstói",
            "autor_en": "Leo Tolstoy",
            "obra_es": "Ana Karénina",
            "obra_en": "Anna Karenina"
        }
    },
    {
        "id": "revolucion-2025",
        "fecha": "2025-01-13",
        "fecha_es": "13 de enero de 2025",
        "fecha_en": "January 13, 2025",
        "titulo_es": "El Monumento a la Revolución",
        "titulo_en": "The Monument to the Revolution",
        "texto_es": [
            "Era una noche fría. Regresábamos tarde de una fiesta, el metro ya había cerrado y no había transporte, así que decidimos quedarnos en uno de los hoteles de Reforma. Fue una noche inolvidable."
        ],
        "texto_en": [
            "It was a cold night. We were coming back late from a party, the metro had already closed and there was no way home, so we decided to stay at one of the hotels on Reforma. It was an unforgettable night."
        ],
        "carpeta": "img/memorias/revolucion-2025",
        "pies_es": [
            "La Revolución de noche"
        ],
        "pies_en": [
            "The Revolution monument at night"
        ]
    },
    {
        "id": "zocalo-2025",
        "fecha": "2025-02-14",
        "fecha_es": "14 de febrero de 2025",
        "fecha_en": "February 14, 2025",
        "titulo_es": "San Valentín en el Zócalo",
        "titulo_en": "Valentine's Day in the Zócalo",
        "texto_es": [
            "San Valentín, una de las fechas más románticas y lindas que hay."
        ],
        "texto_en": [
            "Valentine's Day, one of the most romantic and lovely days there is."
        ],
        "carpeta": "img/memorias/zocalo-2025",
        "pies_es": [
            "Palacio Nacional",
            "Postal del Zócalo"
        ],
        "pies_en": [
            "National Palace",
            "A postcard from the Zócalo"
        ]
    },
    {
        "id": "centro-2025",
        "fecha": "2025-02-24",
        "fecha_es": "24 de febrero de 2025",
        "fecha_en": "February 24, 2025",
        "titulo_es": "Una noche en el centro",
        "titulo_en": "A night downtown",
        "texto_es": [
            "Esa vez había murales por la causa palestina en todo el centro. La resistencia, más que una moda, es un sentimiento por la humanidad: el deber de luchar por la libertad y la dignidad de todo pueblo."
        ],
        "texto_en": [
            "That night there were murals for the Palestinian cause all over downtown. Resistance is not a trend but a feeling for humanity: the duty to fight for the freedom and dignity of every people."
        ],
        "carpeta": "img/memorias/centro-2025",
        "pies_es": [
            "Hemiciclo a Juárez",
            "La dama de la fuente",
            "Mural por Palestina"
        ],
        "pies_en": [
            "Juárez Hemicycle",
            "The lady of the fountain",
            "A mural for Palestine"
        ]
    },
    {
        "id": "rave-2025",
        "fecha": "2025-04-12",
        "fecha_es": "12 de abril de 2025",
        "fecha_en": "April 12, 2025",
        "titulo_es": "Rave en un techo",
        "titulo_en": "A rooftop rave",
        "texto_es": [
            "Sin palabras."
        ],
        "texto_en": [
            "No words."
        ],
        "carpeta": "img/memorias/rave-2025",
        "pies_es": [
            "Luces desde el techo",
            "Con Keyla"
        ],
        "pies_en": [
            "Lights from the rooftop",
            "With Keyla"
        ]
    },
    {
        "id": "marcha-2-octubre",
        "fecha": "2025-10-02",
        "fecha_es": "2 de octubre de 2025",
        "fecha_en": "October 2, 2025",
        "titulo_es": "Fotógrafo de guerra por una noche",
        "titulo_en": "War photographer for a night",
        "texto_es": [
            "Aquella vez marché por la causa palestina y por la causa del 68: el acto terrorista que cometió en Tlatelolco el gobierno priista de Díaz Ordaz, y de Echeverría después. Elegí ser parte del memorial, de la acción por los que hablaron y por los que ya no escuchan."
        ],
        "texto_en": [
            "That night I marched for the Palestinian cause and for the cause of '68: the act of terror the PRI government of Díaz Ordaz, and later Echeverría, committed in Tlatelolco. I chose to be part of the memorial, of the action for those who spoke out and for those who can no longer hear."
        ],
        "carpeta": "img/memorias/marcha-2-octubre",
        "pies_es": [
            "Fuego frente a la Catedral",
            "Banderas y humo en el Zócalo"
        ],
        "pies_en": [
            "Fire in front of the Cathedral",
            "Flags and smoke in the Zócalo"
        ],
        "cita": {
            "es": "«Dios no oye vuestras palabras sino cuando Él mismo las pronuncia a través de vuestros labios.»",
            "en": "“God listens not to your words save when He Himself utters them through your lips.”",
            "autor_es": "Khalil Gibran",
            "autor_en": "Kahlil Gibran",
            "obra_es": "El profeta",
            "obra_en": "The Prophet"
        }
    },
    {
        "id": "boda-cancun",
        "fecha": "2026-03-25",
        "fecha_es": "25 de marzo de 2026",
        "fecha_en": "March 25, 2026",
        "titulo_es": "Una boda en Cancún",
        "titulo_en": "A wedding in Cancún",
        "texto_es": [
            "Era la boda de un familiar muy querido, alguien con quien compartí mi niñez y mi adolescencia. Me encantó ser parte del momento más feliz de su vida y del comienzo de una nueva familia."
        ],
        "texto_en": [
            "It was the wedding of a dear relative, someone I shared my childhood and teenage years with. I loved being part of the happiest moment of their life and the beginning of a new family."
        ],
        "carpeta": "img/memorias/boda-cancun",
        "pies_es": [
            "En Cancún"
        ],
        "pies_en": [
            "In Cancún"
        ]
    }
];
