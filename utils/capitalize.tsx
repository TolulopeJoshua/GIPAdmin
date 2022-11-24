export default function capitalize(text: string | undefined) {
    const words = text?.split(' ');
    return words?.map((word: string) => word && word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}