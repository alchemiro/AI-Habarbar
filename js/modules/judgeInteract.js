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
