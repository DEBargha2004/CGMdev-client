import { createSlice } from '@reduxjs/toolkit'

export type UserType = {
  user_id: string
  user_name: string
  first_name: string
  image_public_id: string
}

export type CurrentUserType = {
  user_id: string
  email: string
  image_public_id: string
}
export type UsersCount = number

const initialState: {
  users: UserType[]
  currentUser: CurrentUserType | null
  usersCount: UsersCount
} = {
  users: [],
  currentUser: null,
  usersCount: 0
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    setCount (state, action) {
      state.usersCount = action.payload
    }
  }
})

export const { setUsers, setCurrentUser, setCount } = usersSlice.actions
export default usersSlice.reducer
