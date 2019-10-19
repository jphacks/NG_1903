export type UserState = {
    userId: string;
    userName : string;
    teamID: string;
    apiToken: string;
}

export type UserData = {
    rate: number
    weeklyDistance: number
    totalDistance: number
    achievementRate: number
}
export type teamDetail = {
    teamGoal: number
    teamMember : teamMemberData[]
}

export type teamMemberData = {
    userName: string,
    userData: UserData
}