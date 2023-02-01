import { GithubUser } from "./GithubUser.js"


export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()

  }
  
  
  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }


  async add(username){
    try{

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists){
        throw new Error ('Usuário já cadastrado!')
      }

      const user = await GithubUser.search(username)
  
      if(user.login === undefined){
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    }catch(error){
      alert(error.message)
    }
  }
  
  
  delete(user){
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)
    
    this.entries = filteredEntries
    
    this.update()
    this.save()
  }
}









export class ViewFavorites extends Favorites{
  constructor(root){
    super(root)
    
    this.tbody = this.root.querySelector('table tbody')
    this.table = this.root.querySelector('table')
    
    this.update()
    this.onadd()

  }

  onadd(){
    const addButton = this.root.querySelector('.search button')
    addButton.addEventListener('click', ()=>{
      const { value } = this.root.querySelector('.search input')
      
      this.add(value)
      
    })
  }

  update(){
    this.removeAllTr()
    this.removeTfoot()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Foto do ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a p').innerText = user.name
      row.querySelector('.user a span').innerText = `/${user.login}`
      row.querySelector('.repositories p').innerText = user.public_repos
      row.querySelector('.followers p').innerText = user.followers

      row.querySelector('.remove').addEventListener('click', () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk){
          this.delete(user)
        }
      })

      this.tbody.append(row)
    })

    if(this.entries.length === 0){
      const tfoot = this.createTfoot()
      this.table.append(tfoot)
    }
    
    
    
    


  }


  
  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/maykbrito.png" alt="Foto do Mayk Brito">
        <a href="https://github.com/maykbrito" target="_blank">
          <p>Mayk Brito</p>
          <span>/maykbrito</span>
        </a>
      </td>
      <td class="repositories"><p>123</p></td>
      <td class="followers"><p>1234</p></td>
      <td><p class="remove">Remover</p></td>
    `

    return tr
  }

  
  removeAllTr(){
    const tr =  this.tbody.querySelectorAll('tr')
    tr.forEach(tr => {
      tr.remove()
    })
    
  }

  createTfoot(){
    const tfoot = document.createElement('tfoot')

    tfoot.innerHTML = `
      <img src="./assets/Estrela.svg" alt="Foto de uma Estrela">
      <h1>Nenhum favorito ainda</h1>
    `
    return tfoot

  }

  removeTfoot(){
    const tfoot = this.table.querySelectorAll('tfoot')
    tfoot.forEach(tfoot => {
      tfoot.remove()
    })
  }
  
}