const userBioData = {
    uid: 'user1234',
    firstName: 'John',
    lastName: 'Doe',
    role: 'QA Placeholder Officer',
    email: 'john.d@fakecompany.com',
    address: '123 Evergreen Terrace',
    birthday: 'Jan 01, 1990',
    supervisorId: 'super1234',
    teamId: 'team1234',
    onPTO: false,
    remainingPTODays: 14,
    remainingSickDays: 5,
}

const supervisorBioData = {
    uid: 'super1234',
    firstName: 'Clark',
    lastName: 'Notkent',
    role: 'QA Placeholder Manager',
    email: 'clark.n@fakecompany.com',
    address: '344 Clinton Street',
    birthday: 'Aug 30, 1975',
    supervisorId: null,
    teamId: 'team1234',
    onPTO: false,
    remainingPTODays: 23,
    remainingSickDays: 2,
}

const teamBioData = {
    uid: 'team1234',
    name: 'QA Test Subjects - Virtual Division',
    manager: 'super1234',
    employees: ['user1234']
}

export { userBioData, supervisorBioData, teamBioData }