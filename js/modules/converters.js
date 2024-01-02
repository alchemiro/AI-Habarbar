const studentConverter = {
  toFirestore: (student) => {
    return {
      id: student.id,
      name: student.name,
      pass: student.pass,
      likes: student.likes,
      project: student.project,
      amount: student.amount,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Student(
      data.id,
      data.name,
      data.pass,
      data.amount,
      data.likes,
      data.project
    );
  },
};

const projectConverter = {
  toFirestore: (project) => {
    return {
      id: project.id,
      name: project.name,
      grades: project.grades,
      likes: project.likes,
      summary: project.summary,
      img: project.img,
      category: project.category,
      round: project.round,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Project(
      data.id,
      data.name,
      data.grades,
      data.likes,
      data.summary,
      data.img,
      data.round,
      data.category
    );
  },
};

const judgeConverter = {
  toFirestore: (judge) => {
    return {
      id: judge.id,
      name: judge.name,
      pass: judge.pass,
      projects: judge.projects,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Judge(data.id, data.name, data.pass, data.projects);
  },
};

const guestConverter = {
  toFirestore: (guest) => {
    return {
      id: guest.id,
      name: guest.name,
      password: guest.pass,
      amount: guest.amount,
      likes: guest.likes,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Guest(data.id, data.name, data.pass, data.amount, data.likes);
  },
};
