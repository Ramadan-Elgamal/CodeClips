import { categories } from "./data";
import { Tutorial } from "./types";

export async function getAllTutorials(): Promise<Tutorial[]> {
    let allTutorials: Tutorial[] = [];
    try {
        const tutorialPromises = categories.map(category => 
            fetch(`/data/${category.path}.json`)
            .then(res => {
                if (!res.ok) {
                    console.error(`Failed to fetch /data/${category.path}.json`);
                    return [];
                }
                return res.json()
            })
            .catch(error => {
                console.error(`Error fetching /data/${category.path}.json`, error);
                return [];
            })
        );

        const tutorialsByCategory = await Promise.all(tutorialPromises);
        allTutorials = tutorialsByCategory.flat();
        
    } catch (error) {
        console.error("Failed to load tutorials", error);
        return [];
    }
    return allTutorials;
}
