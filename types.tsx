export interface article {
    _id: object,
    image: {key?: string, link?: string},
    name: string,
    role: string,
    source: string,
    story: string,
    text?: string,
    isApproved: boolean,
}

export interface biography {
    _id: object,
    image: {key: string},
    name: string,
    gender: string,
    role: string,
    birthYear: number,
    deathYear: number,
    source: string,
    story: string,
    text?: string,
    isApproved: boolean,
}

export interface book {
    _id: object,
    image: {key: string},
    title: string,
    author: string,
    filetype: string,
    document: {key: string, size: number},
    affiliates?: { amazon: string },
    isApproved: boolean,
}

export interface request {
    _id: object,
    text: string,
    info: string,
    parentId: string,
    author: {firstName: string, lastName: string, email: string},
    likes: Array<object>,
    isApproved: boolean,
}

export interface user {
    _id: object,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    gender: string,
    loginType: string,
    subscription: {status: string},
    admin: number,
    dateTime: Date,
    lastLogin: Date,
    isApproved: boolean,
}

export interface auth {
    email: string,
    name: string,
    admin: number,
    token: string,
    timeout: string,
}

export interface docsType {
    articles: Array<article>,
    biographies: Array<biography>,
    books: Array<book>,
    requests: Array<request>,
    users: Array<user>,
}

export interface docsState {
    loading: boolean,
    error: boolean,
    auth: auth,
    docs: docsType
}