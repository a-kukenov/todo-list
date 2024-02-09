import deleteData from "./modules/deleteData.mjs";
import patchData from "./modules/patchData.mjs";
import postData from "./modules/postData.mjs";
var date = new Date();
const getData = url =>
    new Promise((resolve, reject) =>
        fetch(url)
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(error => reject(error))
    )

const container = document.querySelector('.container')
getData('http://localhost:3000/TASKS')
    .then(data => {
        data.forEach(element => {
            if(element.done == "true"){
                container.insertAdjacentHTML(
                    `afterbegin`,
                    `<div class="post" id="${element.id}">
                        <div class="date">${element.date}</div>
                        <div class="title">${element.title}</div>
                        <div class="desc">${element.description}</div>
                        <div class="done"></div>
                        <div class="edit"><i class="fa-solid fa-pencil"></i></div>
                        <div class="delete"><i class="fa-solid fa-trash"></i></div>
                        <div class="priority">Приоритет: ${element.priority}</div>
                    </div>`
                )
                const currentPost = document.querySelector('.post')
                const done = document.querySelector('.done');
                if(element.done == "true"){
                    done.innerHTML = '<i class="fa-solid fa-check"></i>'
                }
                const deleteBut = document.querySelector('.delete');
                deleteBut.addEventListener('click', async() => {
                    try {
                        await deleteData('http://localhost:3000/TASKS', element.id)
                        .then(response => console.log(response));
                    } catch (error) {
                        console.error(error);
                    }
                })
                done.addEventListener('click', async() => {
                    if(element.done == "false"){
                        done.innerHTML = '<i class="fa-solid fa-check"></i>'
                        try {
                            const updatedProductData = { done: "true" };
                            await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                            .then(response => console.log(response, 'данные успешно обновлены'));
                        } 
                        catch (error) {
                            console.error(error);
                        }
                    }
                    else if(element.done == "true"){
                        done.innerHTML = ''
                        try {
                            const updatedProductData = { done: "false" };
                            await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                            .then(response => console.log(response, 'данные успешно обновлены'));
                        } 
                        catch (error) {
                            console.error(error);
                        }
                    }
                })
                const editBut = document.querySelector('.edit');
                editBut.addEventListener('click', () => {
                    currentPost.remove()
                    container.insertAdjacentHTML(
                        `afterbegin`,
                        `<div class="post creatingPost">
                            <input type="text" class="title titleInput" placeholder="Название">
                            <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
                            <div class="priorities">
                                <span class="priorityTitle">Приоритет:</span>
                                <div class="prioritySet highPriority">Высокий</div>
                                <div class="prioritySet medPriority">Средний</div>
                                <div class="prioritySet lowPriority">Низкий</div>
                            </div>
                            <div class="buttons">
                                <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                                <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
                            </div>
                        </div>`
                    )
                    const titleInput = document.querySelector('.titleInput');
                    const descInput = document.querySelector('.descInput');
                    const highPriority = document.querySelector('.highPriority');
                    const medPriority = document.querySelector('.medPriority');
                    const lowPriority = document.querySelector('.lowPriority');
                    const cancelBut = document.querySelector('.cancelBut');
                    const doneBut = document.querySelector('.doneBut');
                    let priority = 'none';
                    
                    titleInput.value = element.title;
                    descInput.value = element.description;
                    switch(element.priority){
                        case 'Высокий':
                            priority = 'Высокий';
                            highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            break
                        case 'Средний':
                            priority = 'Средний';
                            medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            break
                        case 'Низкий':
                            priority = 'Низкий';
                            lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            break
                    }
                    highPriority.addEventListener('click', () => {
                        priority = 'Высокий';
                        highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                    })
                    medPriority.addEventListener('click', () => {
                        priority = 'Средний';
                        medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                    })
                    lowPriority.addEventListener('click', () => {
                        priority = 'Низкий';
                        lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                    })
                    cancelBut.addEventListener('click', () => {
                        location.reload()
                    })
                    doneBut.addEventListener('click', async() => {
                        try {
                            const updatedProductData = {
                                title: `${titleInput.value}`,
                                description: `${descInput.value}`,
                                priority: priority
                            };
                            await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                            .then(response => console.log(response, 'данные успешно обновлены'));
                        } catch (error) {
                            console.error(error);
                        }
                        location.reload()
                    })
                })
            }
        })
        data.forEach(element => {
            if(element.done == "false"){
                container.insertAdjacentHTML(
                    `afterbegin`,
                    `<div class="post" id="${element.id}">
                        <div class="date">${element.date}</div>
                        <div class="title">${element.title}</div>
                        <div class="desc">${element.description}</div>
                        <div class="done"></div>
                        <div class="edit"><i class="fa-solid fa-pencil"></i></div>
                        <div class="delete"><i class="fa-solid fa-trash"></i></div>
                        <div class="priority">Приоритет: ${element.priority}</div>
                    </div>`
                )
                const currentPost = document.querySelector('.post')
                const done = document.querySelector('.done');
                if(element.done == "true"){
                    done.innerHTML = '<i class="fa-solid fa-check"></i>'
                }
                const deleteBut = document.querySelector('.delete');
                deleteBut.addEventListener('click', async() => {
                    try {
                        await deleteData('http://localhost:3000/TASKS', element.id)
                        .then(response => console.log(response));
                    } catch (error) {
                        console.error(error);
                    }
                })
                done.addEventListener('click', async() => {
                    if(element.done == "false"){
                        done.innerHTML = '<i class="fa-solid fa-check"></i>'
                        try {
                            const updatedProductData = { done: "true" };
                            await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                            .then(response => console.log(response, 'данные успешно обновлены'));
                        } 
                        catch (error) {
                            console.error(error);
                        }
                    }
                    else if(element.done == "true"){
                        done.innerHTML = ''
                        try {
                            const updatedProductData = { done: "false" };
                            await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                            .then(response => console.log(response, 'данные успешно обновлены'));
                        } 
                        catch (error) {
                            console.error(error);
                        }
                    }
                })
                const editBut = document.querySelector('.edit');
                editBut.addEventListener('click', () => {
                    currentPost.remove()
                    container.insertAdjacentHTML(
                        `afterbegin`,
                        `<div class="post creatingPost">
                            <input type="text" class="title titleInput" placeholder="Название">
                            <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
                            <div class="priorities">
                                <span class="priorityTitle">Приоритет:</span>
                                <div class="prioritySet highPriority">Высокий</div>
                                <div class="prioritySet medPriority">Средний</div>
                                <div class="prioritySet lowPriority">Низкий</div>
                            </div>
                            <div class="buttons">
                                <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                                <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
                            </div>
                        </div>`
                    )
                    const titleInput = document.querySelector('.titleInput');
                    const descInput = document.querySelector('.descInput');
                    const highPriority = document.querySelector('.highPriority');
                    const medPriority = document.querySelector('.medPriority');
                    const lowPriority = document.querySelector('.lowPriority');
                    const cancelBut = document.querySelector('.cancelBut');
                    const doneBut = document.querySelector('.doneBut');
                    let priority = 'none';
                    
                    titleInput.value = element.title;
                    descInput.value = element.description;
                    switch(element.priority){
                        case 'Высокий':
                            priority = 'Высокий';
                            highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            break
                        case 'Средний':
                            priority = 'Средний';
                            medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            break
                        case 'Низкий':
                            priority = 'Низкий';
                            lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            break
                    }
                    highPriority.addEventListener('click', () => {
                        priority = 'Высокий';
                        highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                    })
                    medPriority.addEventListener('click', () => {
                        priority = 'Средний';
                        medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                    })
                    lowPriority.addEventListener('click', () => {
                        priority = 'Низкий';
                        lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                    })
                    cancelBut.addEventListener('click', () => {
                        location.reload()
                    })
                    doneBut.addEventListener('click', async() => {
                        try {
                            const updatedProductData = {
                                title: `${titleInput.value}`,
                                description: `${descInput.value}`,
                                priority: priority
                            };
                            await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                            .then(response => console.log(response, 'данные успешно обновлены'));
                        } catch (error) {
                            console.error(error);
                        }
                        location.reload()
                    })
                })
            }
        })
    })
    .catch(error => console.error(error))

const addPostBut = document.querySelector('.addPost');
addPostBut.addEventListener('click', async() => {
    container.insertAdjacentHTML(
        `afterbegin`,
        `<div class="post creatingPost">
            <input type="text" class="title titleInput" placeholder="Название">
            <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
            <div class="priorities">
                <span class="priorityTitle">Приоритет:</span>
                <div class="prioritySet highPriority">Высокий</div>
                <div class="prioritySet medPriority">Средний</div>
                <div class="prioritySet lowPriority">Низкий</div>
            </div>
            <div class="buttons">
                <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
            </div>
        </div>`
    )
    const titleInput = document.querySelector('.titleInput');
    const descInput = document.querySelector('.descInput');
    const highPriority = document.querySelector('.highPriority');
    const medPriority = document.querySelector('.medPriority');
    const lowPriority = document.querySelector('.lowPriority');
    const cancelBut = document.querySelector('.cancelBut');
    const doneBut = document.querySelector('.doneBut');
    let priority = 'none';

    highPriority.addEventListener('click', () => {
        priority = 'Высокий';
        highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
    })
    medPriority.addEventListener('click', () => {
        priority = 'Средний';
        medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
    })
    lowPriority.addEventListener('click', () => {
        priority = 'Низкий';
        lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
    })
    cancelBut.addEventListener('click', () => {
        location.reload()
    })
    doneBut.addEventListener('click', async() => {
        try {
            await postData('http://localhost:3000/TASKS', {
                title: `${titleInput.value}`,
                description: `${descInput.value}`,
                priority: priority,
                date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`,
                done: "false",
                id: `${document.querySelectorAll('.post').length - 1}`
              })
                .then(response => {console.log(response, 'данные успешно добавлены')})
        } 
        catch (error) {
            console.error(error)
        }
        location.reload()
    })
})
const priorityFilter = document.querySelector('.priorityFilter');
const dateFilter = document.querySelector('.dateFilter');
const doneFilter = document.querySelector('.doneFilter');
priorityFilter.addEventListener('click', () => {
    priorityFilter.style.backgroundColor = 'rgb(170, 170, 170)';
    dateFilter.style.backgroundColor = 'rgb(230, 230, 230)';
    doneFilter.style.backgroundColor = 'rgb(230, 230, 230)';
    container.innerHTML = '';
    getData('http://localhost:3000/TASKS')
        .then(data => {
            data.forEach(element => {
                if(element.priority == "Низкий"){
                    container.insertAdjacentHTML(
                        `afterbegin`,
                        `<div class="post" id="${element.id}">
                            <div class="date">${element.date}</div>
                            <div class="title">${element.title}</div>
                            <div class="desc">${element.description}</div>
                            <div class="done"></div>
                            <div class="edit"><i class="fa-solid fa-pencil"></i></div>
                            <div class="delete"><i class="fa-solid fa-trash"></i></div>
                            <div class="priority">Приоритет: ${element.priority}</div>
                        </div>`
                    )
                    const currentPost = document.querySelector('.post')
                    const done = document.querySelector('.done');
                    if(element.done == "true"){
                        done.innerHTML = '<i class="fa-solid fa-check"></i>'
                    }
                    const deleteBut = document.querySelector('.delete');
                    deleteBut.addEventListener('click', async() => {
                        try {
                            await deleteData('http://localhost:3000/TASKS', element.id)
                            .then(response => console.log(response));
                        } catch (error) {
                            console.error(error);
                        }
                    })
                    done.addEventListener('click', async() => {
                        if(element.done == "false"){
                            done.innerHTML = '<i class="fa-solid fa-check"></i>'
                            try {
                                const updatedProductData = { done: "true" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                        else if(element.done == "true"){
                            done.innerHTML = ''
                            try {
                                const updatedProductData = { done: "false" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                    })
                    const editBut = document.querySelector('.edit');
                    editBut.addEventListener('click', () => {
                        currentPost.remove()
                        container.insertAdjacentHTML(
                            `afterbegin`,
                            `<div class="post creatingPost">
                                <input type="text" class="title titleInput" placeholder="Название">
                                <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
                                <div class="priorities">
                                    <span class="priorityTitle">Приоритет:</span>
                                    <div class="prioritySet highPriority">Высокий</div>
                                    <div class="prioritySet medPriority">Средний</div>
                                    <div class="prioritySet lowPriority">Низкий</div>
                                </div>
                                <div class="buttons">
                                    <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                                    <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
                                </div>
                            </div>`
                        )
                        const titleInput = document.querySelector('.titleInput');
                        const descInput = document.querySelector('.descInput');
                        const highPriority = document.querySelector('.highPriority');
                        const medPriority = document.querySelector('.medPriority');
                        const lowPriority = document.querySelector('.lowPriority');
                        const cancelBut = document.querySelector('.cancelBut');
                        const doneBut = document.querySelector('.doneBut');
                        let priority = 'none';
                        
                        titleInput.value = element.title;
                        descInput.value = element.description;
                        switch(element.priority){
                            case 'Высокий':
                                priority = 'Высокий';
                                highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Средний':
                                priority = 'Средний';
                                medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Низкий':
                                priority = 'Низкий';
                                lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                        }
                        highPriority.addEventListener('click', () => {
                            priority = 'Высокий';
                            highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        medPriority.addEventListener('click', () => {
                            priority = 'Средний';
                            medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        lowPriority.addEventListener('click', () => {
                            priority = 'Низкий';
                            lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        cancelBut.addEventListener('click', () => {
                            location.reload()
                        })
                        doneBut.addEventListener('click', async() => {
                            try {
                                const updatedProductData = {
                                    title: `${titleInput.value}`,
                                    description: `${descInput.value}`,
                                    priority: priority
                                };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } catch (error) {
                                console.error(error);
                            }
                            location.reload()
                        })
                    })
                }
            })
            data.forEach(element => {
                if(element.priority == "Средний"){
                    container.insertAdjacentHTML(
                        `afterbegin`,
                        `<div class="post" id="${element.id}">
                            <div class="date">${element.date}</div>
                            <div class="title">${element.title}</div>
                            <div class="desc">${element.description}</div>
                            <div class="done"></div>
                            <div class="edit"><i class="fa-solid fa-pencil"></i></div>
                            <div class="delete"><i class="fa-solid fa-trash"></i></div>
                            <div class="priority">Приоритет: ${element.priority}</div>
                        </div>`
                    )
                    const currentPost = document.querySelector('.post')
                    const done = document.querySelector('.done');
                    if(element.done == "true"){
                        done.innerHTML = '<i class="fa-solid fa-check"></i>'
                    }
                    const deleteBut = document.querySelector('.delete');
                    deleteBut.addEventListener('click', async() => {
                        try {
                            await deleteData('http://localhost:3000/TASKS', element.id)
                            .then(response => console.log(response));
                        } catch (error) {
                            console.error(error);
                        }
                    })
                    done.addEventListener('click', async() => {
                        if(element.done == "false"){
                            done.innerHTML = '<i class="fa-solid fa-check"></i>'
                            try {
                                const updatedProductData = { done: "true" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                        else if(element.done == "true"){
                            done.innerHTML = ''
                            try {
                                const updatedProductData = { done: "false" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                    })
                    const editBut = document.querySelector('.edit');
                    editBut.addEventListener('click', () => {
                        currentPost.remove()
                        container.insertAdjacentHTML(
                            `afterbegin`,
                            `<div class="post creatingPost">
                                <input type="text" class="title titleInput" placeholder="Название">
                                <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
                                <div class="priorities">
                                    <span class="priorityTitle">Приоритет:</span>
                                    <div class="prioritySet highPriority">Высокий</div>
                                    <div class="prioritySet medPriority">Средний</div>
                                    <div class="prioritySet lowPriority">Низкий</div>
                                </div>
                                <div class="buttons">
                                    <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                                    <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
                                </div>
                            </div>`
                        )
                        const titleInput = document.querySelector('.titleInput');
                        const descInput = document.querySelector('.descInput');
                        const highPriority = document.querySelector('.highPriority');
                        const medPriority = document.querySelector('.medPriority');
                        const lowPriority = document.querySelector('.lowPriority');
                        const cancelBut = document.querySelector('.cancelBut');
                        const doneBut = document.querySelector('.doneBut');
                        let priority = 'none';
                        
                        titleInput.value = element.title;
                        descInput.value = element.description;
                        switch(element.priority){
                            case 'Высокий':
                                priority = 'Высокий';
                                highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Средний':
                                priority = 'Средний';
                                medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Низкий':
                                priority = 'Низкий';
                                lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                        }
                        highPriority.addEventListener('click', () => {
                            priority = 'Высокий';
                            highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        medPriority.addEventListener('click', () => {
                            priority = 'Средний';
                            medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        lowPriority.addEventListener('click', () => {
                            priority = 'Низкий';
                            lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        cancelBut.addEventListener('click', () => {
                            location.reload()
                        })
                        doneBut.addEventListener('click', async() => {
                            try {
                                const updatedProductData = {
                                    title: `${titleInput.value}`,
                                    description: `${descInput.value}`,
                                    priority: priority
                                };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } catch (error) {
                                console.error(error);
                            }
                            location.reload()
                        })
                    })
                }
            })
            data.forEach(element => {
                if(element.priority == "Высокий"){
                    container.insertAdjacentHTML(
                        `afterbegin`,
                        `<div class="post" id="${element.id}">
                            <div class="date">${element.date}</div>
                            <div class="title">${element.title}</div>
                            <div class="desc">${element.description}</div>
                            <div class="done"></div>
                            <div class="edit"><i class="fa-solid fa-pencil"></i></div>
                            <div class="delete"><i class="fa-solid fa-trash"></i></div>
                            <div class="priority">Приоритет: ${element.priority}</div>
                        </div>`
                    )
                    const currentPost = document.querySelector('.post')
                    const done = document.querySelector('.done');
                    if(element.done == "true"){
                        done.innerHTML = '<i class="fa-solid fa-check"></i>'
                    }
                    const deleteBut = document.querySelector('.delete');
                    deleteBut.addEventListener('click', async() => {
                        try {
                            await deleteData('http://localhost:3000/TASKS', element.id)
                            .then(response => console.log(response));
                        } catch (error) {
                            console.error(error);
                        }
                    })
                    done.addEventListener('click', async() => {
                        if(element.done == "false"){
                            done.innerHTML = '<i class="fa-solid fa-check"></i>'
                            try {
                                const updatedProductData = { done: "true" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                        else if(element.done == "true"){
                            done.innerHTML = ''
                            try {
                                const updatedProductData = { done: "false" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                    })
                    const editBut = document.querySelector('.edit');
                    editBut.addEventListener('click', () => {
                        currentPost.remove()
                        container.insertAdjacentHTML(
                            `afterbegin`,
                            `<div class="post creatingPost">
                                <input type="text" class="title titleInput" placeholder="Название">
                                <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
                                <div class="priorities">
                                    <span class="priorityTitle">Приоритет:</span>
                                    <div class="prioritySet highPriority">Высокий</div>
                                    <div class="prioritySet medPriority">Средний</div>
                                    <div class="prioritySet lowPriority">Низкий</div>
                                </div>
                                <div class="buttons">
                                    <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                                    <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
                                </div>
                            </div>`
                        )
                        const titleInput = document.querySelector('.titleInput');
                        const descInput = document.querySelector('.descInput');
                        const highPriority = document.querySelector('.highPriority');
                        const medPriority = document.querySelector('.medPriority');
                        const lowPriority = document.querySelector('.lowPriority');
                        const cancelBut = document.querySelector('.cancelBut');
                        const doneBut = document.querySelector('.doneBut');
                        let priority = 'none';
                        
                        titleInput.value = element.title;
                        descInput.value = element.description;
                        switch(element.priority){
                            case 'Высокий':
                                priority = 'Высокий';
                                highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Средний':
                                priority = 'Средний';
                                medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Низкий':
                                priority = 'Низкий';
                                lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                        }
                        highPriority.addEventListener('click', () => {
                            priority = 'Высокий';
                            highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        medPriority.addEventListener('click', () => {
                            priority = 'Средний';
                            medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        lowPriority.addEventListener('click', () => {
                            priority = 'Низкий';
                            lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        cancelBut.addEventListener('click', () => {
                            location.reload()
                        })
                        doneBut.addEventListener('click', async() => {
                            try {
                                const updatedProductData = {
                                    title: `${titleInput.value}`,
                                    description: `${descInput.value}`,
                                    priority: priority
                                };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } catch (error) {
                                console.error(error);
                            }
                            location.reload()
                        })
                    })
                }
            })
        })
    container.insertAdjacentHTML(
        `beforeend`,
        `<div class="addPost">Добавить</div>`
    )
    const addPostBut = document.querySelector('.addPost');
    addPostBut.addEventListener('click', async() => {
    container.insertAdjacentHTML(
        `afterbegin`,
        `<div class="post creatingPost">
            <input type="text" class="title titleInput" placeholder="Название">
            <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
            <div class="priorities">
                <span class="priorityTitle">Приоритет:</span>
                <div class="prioritySet highPriority">Высокий</div>
                <div class="prioritySet medPriority">Средний</div>
                <div class="prioritySet lowPriority">Низкий</div>
            </div>
            <div class="buttons">
                <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
            </div>
        </div>`
    )
    const titleInput = document.querySelector('.titleInput');
    const descInput = document.querySelector('.descInput');
    const highPriority = document.querySelector('.highPriority');
    const medPriority = document.querySelector('.medPriority');
    const lowPriority = document.querySelector('.lowPriority');
    const cancelBut = document.querySelector('.cancelBut');
    const doneBut = document.querySelector('.doneBut');
    let priority = 'none';

    highPriority.addEventListener('click', () => {
        priority = 'Высокий';
        highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
    })
    medPriority.addEventListener('click', () => {
        priority = 'Средний';
        medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
    })
    lowPriority.addEventListener('click', () => {
        priority = 'Низкий';
        lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
    })
    cancelBut.addEventListener('click', () => {
        location.reload()
    })
    doneBut.addEventListener('click', async() => {
        try {
            await postData('http://localhost:3000/TASKS', {
                title: `${titleInput.value}`,
                description: `${descInput.value}`,
                priority: priority,
                date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`,
                done: "false",
                id: `${document.querySelectorAll('.post').length - 1}`
              })
                .then(response => {console.log(response, 'данные успешно добавлены')})
        } 
        catch (error) {
            console.error(error)
        }
        location.reload()
    })
    })
})
dateFilter.addEventListener('click', () => {
    dateFilter.style.backgroundColor = 'rgb(170, 170, 170)';
    priorityFilter.style.backgroundColor = 'rgb(230, 230, 230)';
    doneFilter.style.backgroundColor = 'rgb(230, 230, 230)';
    container.innerHTML = '';
    getData('http://localhost:3000/TASKS')
        .then(data => {
            data.forEach(element => {
                    container.insertAdjacentHTML(
                        `afterbegin`,
                        `<div class="post" id="${element.id}">
                            <div class="date">${element.date}</div>
                            <div class="title">${element.title}</div>
                            <div class="desc">${element.description}</div>
                            <div class="done"></div>
                            <div class="edit"><i class="fa-solid fa-pencil"></i></div>
                            <div class="delete"><i class="fa-solid fa-trash"></i></div>
                            <div class="priority">Приоритет: ${element.priority}</div>
                        </div>`
                    )
                    const currentPost = document.querySelector('.post')
                    const done = document.querySelector('.done');
                    if(element.done == "true"){
                        done.innerHTML = '<i class="fa-solid fa-check"></i>'
                    }
                    const deleteBut = document.querySelector('.delete');
                    deleteBut.addEventListener('click', async() => {
                        try {
                            await deleteData('http://localhost:3000/TASKS', element.id)
                            .then(response => console.log(response));
                        } catch (error) {
                            console.error(error);
                        }
                    })
                    done.addEventListener('click', async() => {
                        if(element.done == "false"){
                            done.innerHTML = '<i class="fa-solid fa-check"></i>'
                            try {
                                const updatedProductData = { done: "true" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                        else if(element.done == "true"){
                            done.innerHTML = ''
                            try {
                                const updatedProductData = { done: "false" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                    })
                    const editBut = document.querySelector('.edit');
                    editBut.addEventListener('click', () => {
                        currentPost.remove()
                        container.insertAdjacentHTML(
                            `afterbegin`,
                            `<div class="post creatingPost">
                                <input type="text" class="title titleInput" placeholder="Название">
                                <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
                                <div class="priorities">
                                    <span class="priorityTitle">Приоритет:</span>
                                    <div class="prioritySet highPriority">Высокий</div>
                                    <div class="prioritySet medPriority">Средний</div>
                                    <div class="prioritySet lowPriority">Низкий</div>
                                </div>
                                <div class="buttons">
                                    <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                                    <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
                                </div>
                            </div>`
                        )
                        const titleInput = document.querySelector('.titleInput');
                        const descInput = document.querySelector('.descInput');
                        const highPriority = document.querySelector('.highPriority');
                        const medPriority = document.querySelector('.medPriority');
                        const lowPriority = document.querySelector('.lowPriority');
                        const cancelBut = document.querySelector('.cancelBut');
                        const doneBut = document.querySelector('.doneBut');
                        let priority = 'none';
                        
                        titleInput.value = element.title;
                        descInput.value = element.description;
                        switch(element.priority){
                            case 'Высокий':
                                priority = 'Высокий';
                                highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Средний':
                                priority = 'Средний';
                                medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Низкий':
                                priority = 'Низкий';
                                lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                        }
                        highPriority.addEventListener('click', () => {
                            priority = 'Высокий';
                            highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        medPriority.addEventListener('click', () => {
                            priority = 'Средний';
                            medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        lowPriority.addEventListener('click', () => {
                            priority = 'Низкий';
                            lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        cancelBut.addEventListener('click', () => {
                            location.reload()
                        })
                        doneBut.addEventListener('click', async() => {
                            try {
                                const updatedProductData = {
                                    title: `${titleInput.value}`,
                                    description: `${descInput.value}`,
                                    priority: priority
                                };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } catch (error) {
                                console.error(error);
                            }
                            location.reload()
                        })
                    })
            })
        })
        container.insertAdjacentHTML(
            `beforeend`,
            `<div class="addPost">Добавить</div>`
        )
        const addPostBut = document.querySelector('.addPost');
        addPostBut.addEventListener('click', async() => {
        container.insertAdjacentHTML(
            `afterbegin`,
            `<div class="post creatingPost">
                <input type="text" class="title titleInput" placeholder="Название">
                <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
                <div class="priorities">
                    <span class="priorityTitle">Приоритет:</span>
                    <div class="prioritySet highPriority">Высокий</div>
                    <div class="prioritySet medPriority">Средний</div>
                    <div class="prioritySet lowPriority">Низкий</div>
                </div>
                <div class="buttons">
                    <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                    <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
                </div>
            </div>`
        )
        const titleInput = document.querySelector('.titleInput');
        const descInput = document.querySelector('.descInput');
        const highPriority = document.querySelector('.highPriority');
        const medPriority = document.querySelector('.medPriority');
        const lowPriority = document.querySelector('.lowPriority');
        const cancelBut = document.querySelector('.cancelBut');
        const doneBut = document.querySelector('.doneBut');
        let priority = 'none';
    
        highPriority.addEventListener('click', () => {
            priority = 'Высокий';
            highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        })
        medPriority.addEventListener('click', () => {
            priority = 'Средний';
            medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        })
        lowPriority.addEventListener('click', () => {
            priority = 'Низкий';
            lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        })
        cancelBut.addEventListener('click', () => {
            location.reload()
        })
        doneBut.addEventListener('click', async() => {
            try {
                await postData('http://localhost:3000/TASKS', {
                    title: `${titleInput.value}`,
                    description: `${descInput.value}`,
                    priority: priority,
                    date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`,
                    done: "false",
                    id: `${document.querySelectorAll('.post').length - 1}`
                  })
                    .then(response => {console.log(response, 'данные успешно добавлены')})
            } 
            catch (error) {
                console.error(error)
            }
            location.reload()
        })
        })
})
doneFilter.addEventListener('click', () => {
    doneFilter.style.backgroundColor = 'rgb(170, 170, 170)';
    dateFilter.style.backgroundColor = 'rgb(230, 230, 230)';
    priorityFilter.style.backgroundColor = 'rgb(230, 230, 230)';
    container.innerHTML = '';
    getData('http://localhost:3000/TASKS')
        .then(data => {
            data.forEach(element => {
                if(element.done == "false"){
                    container.insertAdjacentHTML(
                        `afterbegin`,
                        `<div class="post" id="${element.id}">
                            <div class="date">${element.date}</div>
                            <div class="title">${element.title}</div>
                            <div class="desc">${element.description}</div>
                            <div class="done"></div>
                            <div class="edit"><i class="fa-solid fa-pencil"></i></div>
                            <div class="delete"><i class="fa-solid fa-trash"></i></div>
                            <div class="priority">Приоритет: ${element.priority}</div>
                        </div>`
                    )
                    const currentPost = document.querySelector('.post')
                    const done = document.querySelector('.done');
                    if(element.done == "true"){
                        done.innerHTML = '<i class="fa-solid fa-check"></i>'
                    }
                    const deleteBut = document.querySelector('.delete');
                    deleteBut.addEventListener('click', async() => {
                        try {
                            await deleteData('http://localhost:3000/TASKS', element.id)
                            .then(response => console.log(response));
                        } catch (error) {
                            console.error(error);
                        }
                    })
                    done.addEventListener('click', async() => {
                        if(element.done == "false"){
                            done.innerHTML = '<i class="fa-solid fa-check"></i>'
                            try {
                                const updatedProductData = { done: "true" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                        else if(element.done == "true"){
                            done.innerHTML = ''
                            try {
                                const updatedProductData = { done: "false" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                    })
                    const editBut = document.querySelector('.edit');
                    editBut.addEventListener('click', () => {
                        currentPost.remove()
                        container.insertAdjacentHTML(
                            `afterbegin`,
                            `<div class="post creatingPost">
                                <input type="text" class="title titleInput" placeholder="Название">
                                <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
                                <div class="priorities">
                                    <span class="priorityTitle">Приоритет:</span>
                                    <div class="prioritySet highPriority">Высокий</div>
                                    <div class="prioritySet medPriority">Средний</div>
                                    <div class="prioritySet lowPriority">Низкий</div>
                                </div>
                                <div class="buttons">
                                    <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                                    <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
                                </div>
                            </div>`
                        )
                        const titleInput = document.querySelector('.titleInput');
                        const descInput = document.querySelector('.descInput');
                        const highPriority = document.querySelector('.highPriority');
                        const medPriority = document.querySelector('.medPriority');
                        const lowPriority = document.querySelector('.lowPriority');
                        const cancelBut = document.querySelector('.cancelBut');
                        const doneBut = document.querySelector('.doneBut');
                        let priority = 'none';
                        
                        titleInput.value = element.title;
                        descInput.value = element.description;
                        switch(element.priority){
                            case 'Высокий':
                                priority = 'Высокий';
                                highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Средний':
                                priority = 'Средний';
                                medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Низкий':
                                priority = 'Низкий';
                                lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                        }
                        highPriority.addEventListener('click', () => {
                            priority = 'Высокий';
                            highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        medPriority.addEventListener('click', () => {
                            priority = 'Средний';
                            medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        lowPriority.addEventListener('click', () => {
                            priority = 'Низкий';
                            lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        cancelBut.addEventListener('click', () => {
                            location.reload()
                        })
                        doneBut.addEventListener('click', async() => {
                            try {
                                const updatedProductData = {
                                    title: `${titleInput.value}`,
                                    description: `${descInput.value}`,
                                    priority: priority
                                };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } catch (error) {
                                console.error(error);
                            }
                            location.reload()
                        })
                    })
                }
            })
            data.forEach(element => {
                if(element.done == "true"){
                    container.insertAdjacentHTML(
                        `afterbegin`,
                        `<div class="post" id="${element.id}">
                            <div class="date">${element.date}</div>
                            <div class="title">${element.title}</div>
                            <div class="desc">${element.description}</div>
                            <div class="done"></div>
                            <div class="edit"><i class="fa-solid fa-pencil"></i></div>
                            <div class="delete"><i class="fa-solid fa-trash"></i></div>
                            <div class="priority">Приоритет: ${element.priority}</div>
                        </div>`
                    )
                    const currentPost = document.querySelector('.post')
                    const done = document.querySelector('.done');
                    if(element.done == "true"){
                        done.innerHTML = '<i class="fa-solid fa-check"></i>'
                    }
                    const deleteBut = document.querySelector('.delete');
                    deleteBut.addEventListener('click', async() => {
                        try {
                            await deleteData('http://localhost:3000/TASKS', element.id)
                            .then(response => console.log(response));
                        } catch (error) {
                            console.error(error);
                        }
                    })
                    done.addEventListener('click', async() => {
                        if(element.done == "false"){
                            done.innerHTML = '<i class="fa-solid fa-check"></i>'
                            try {
                                const updatedProductData = { done: "true" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                        else if(element.done == "true"){
                            done.innerHTML = ''
                            try {
                                const updatedProductData = { done: "false" };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } 
                            catch (error) {
                                console.error(error);
                            }
                        }
                    })
                    const editBut = document.querySelector('.edit');
                    editBut.addEventListener('click', () => {
                        currentPost.remove()
                        container.insertAdjacentHTML(
                            `afterbegin`,
                            `<div class="post creatingPost">
                                <input type="text" class="title titleInput" placeholder="Название">
                                <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
                                <div class="priorities">
                                    <span class="priorityTitle">Приоритет:</span>
                                    <div class="prioritySet highPriority">Высокий</div>
                                    <div class="prioritySet medPriority">Средний</div>
                                    <div class="prioritySet lowPriority">Низкий</div>
                                </div>
                                <div class="buttons">
                                    <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                                    <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
                                </div>
                            </div>`
                        )
                        const titleInput = document.querySelector('.titleInput');
                        const descInput = document.querySelector('.descInput');
                        const highPriority = document.querySelector('.highPriority');
                        const medPriority = document.querySelector('.medPriority');
                        const lowPriority = document.querySelector('.lowPriority');
                        const cancelBut = document.querySelector('.cancelBut');
                        const doneBut = document.querySelector('.doneBut');
                        let priority = 'none';
                        
                        titleInput.value = element.title;
                        descInput.value = element.description;
                        switch(element.priority){
                            case 'Высокий':
                                priority = 'Высокий';
                                highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Средний':
                                priority = 'Средний';
                                medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                            case 'Низкий':
                                priority = 'Низкий';
                                lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                                medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                                break
                        }
                        highPriority.addEventListener('click', () => {
                            priority = 'Высокий';
                            highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        medPriority.addEventListener('click', () => {
                            priority = 'Средний';
                            medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        lowPriority.addEventListener('click', () => {
                            priority = 'Низкий';
                            lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
                            medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                            highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
                        })
                        cancelBut.addEventListener('click', () => {
                            location.reload()
                        })
                        doneBut.addEventListener('click', async() => {
                            try {
                                const updatedProductData = {
                                    title: `${titleInput.value}`,
                                    description: `${descInput.value}`,
                                    priority: priority
                                };
                                await patchData('http://localhost:3000/TASKS', element.id, updatedProductData)
                                .then(response => console.log(response, 'данные успешно обновлены'));
                            } catch (error) {
                                console.error(error);
                            }
                            location.reload()
                        })
                    })
                }
            })
        })
        .catch(error => console.error(error))
    container.insertAdjacentHTML(
        `beforeend`,
        `<div class="addPost">Добавить</div>`
    )
    const addPostBut = document.querySelector('.addPost');
    addPostBut.addEventListener('click', async() => {
    container.insertAdjacentHTML(
        `afterbegin`,
        `<div class="post creatingPost">
            <input type="text" class="title titleInput" placeholder="Название">
            <textarea class="desc descInput creatingPostDesc" placeholder="Описание"></textarea>
            <div class="priorities">
                <span class="priorityTitle">Приоритет:</span>
                <div class="prioritySet highPriority">Высокий</div>
                <div class="prioritySet medPriority">Средний</div>
                <div class="prioritySet lowPriority">Низкий</div>
            </div>
            <div class="buttons">
                <div class="cancelBut">Отмена <i class="fa-solid fa-xmark"></i></div>
                <div class="doneBut">Готово <i class="fa-solid fa-check"></i></div>
            </div>
        </div>`
    )
    const titleInput = document.querySelector('.titleInput');
    const descInput = document.querySelector('.descInput');
    const highPriority = document.querySelector('.highPriority');
    const medPriority = document.querySelector('.medPriority');
    const lowPriority = document.querySelector('.lowPriority');
    const cancelBut = document.querySelector('.cancelBut');
    const doneBut = document.querySelector('.doneBut');
    let priority = 'none';

    highPriority.addEventListener('click', () => {
        priority = 'Высокий';
        highPriority.style.backgroundColor = 'rgb(191, 191, 191)';
        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
    })
    medPriority.addEventListener('click', () => {
        priority = 'Средний';
        medPriority.style.backgroundColor = 'rgb(191, 191, 191)';
        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        lowPriority.style.backgroundColor = 'rgb(255, 255, 255)';
    })
    lowPriority.addEventListener('click', () => {
        priority = 'Низкий';
        lowPriority.style.backgroundColor = 'rgb(191, 191, 191)';
        medPriority.style.backgroundColor = 'rgb(255, 255, 255)';
        highPriority.style.backgroundColor = 'rgb(255, 255, 255)';
    })
    cancelBut.addEventListener('click', () => {
        location.reload()
    })
    doneBut.addEventListener('click', async() => {
        try {
            await postData('http://localhost:3000/TASKS', {
                title: `${titleInput.value}`,
                description: `${descInput.value}`,
                priority: priority,
                date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`,
                done: "false",
                id: `${document.querySelectorAll('.post').length - 1}`
              })
                .then(response => {console.log(response, 'данные успешно добавлены')})
        } 
        catch (error) {
            console.error(error)
        }
        location.reload()
    })
    })
})


