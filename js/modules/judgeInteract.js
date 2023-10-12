import {
    judgesCollection,
    projectsCollection,
    db,
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from "./database.js";
import { Judge, Project } from "./users.js";
import {
    pullProject,
    pullProjectParam,
    pushProjectParam,
} from "./projectInteract.js";

const judgeConverter = {
    toFirestore: (judge) => {
        return {
            id: judge.id,
            name: judge.name,
            pass: judge.pass,
            Projects: judge.Projects,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Judge(data.id, data.pass, data.name, data.Projects);
    },
};

function addGradeToProject(grade, projectID) {
    pushProjectParam(projectID, "grades", grade);
}

function removeGradeFromProject(grade, projectID) {
  //remove first instance of grade in a project
    const projectGrades = pullProjectParam(projectID, "grades");
    const index = projectGrades.indexOf(grade);
    if (index > -1) {
        projectGrades.splice(index, 1);
    }

    pushProjectParam(projectID, "grades", projectGrades);
}
