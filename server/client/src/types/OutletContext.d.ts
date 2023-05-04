export default interface OutletContext {
   loggedIn: [boolean, (value:boolean) => void]
   user: [Record<string,any>, (value:Record<string,any>) => void]
   page: [string, (value:string) => void]
}