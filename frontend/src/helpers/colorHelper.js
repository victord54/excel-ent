// Tableau associant un pseudo à sa couleur
const colorAssociation = {};

// Fonction pour générer une couleur à partir d'une chaîne de caractères
function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Fonction pour obtenir la couleur d'un pseudo
export function getColorByPseudo(pseudo) {
    if(pseudo in colorAssociation) {
        return colorAssociation[pseudo];
    }
    const color = generateRandomColor();
    colorAssociation[pseudo] = color;
    return color;
}