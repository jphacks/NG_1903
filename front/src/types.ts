export type UserState = {
    userId: string;
    userName : string;
    teamID: string;
    apiToken: any; //FIX
}

export type UserData = {
    rate: number
    weeklyDistance: number
    totalDistance: number
    achievementRate: number
}
export type TeamDetail = {
    teamGoal: number
    teamMember : TeamMemberData[]
}

export type TeamMemberData = {
    userName: string,
    userData: UserData
}