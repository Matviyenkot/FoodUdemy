window.addEventListener('DOMContentLoaded', () => {

    ///////////TABS
    
    
        const tabs = document.querySelectorAll('.tabheader__item'),
              tabContent = document.querySelectorAll('.tabcontent'),
              tabParrent = document.querySelector('.tabheader__items');
    
    
              function hideTabContent () {
                  tabContent.forEach(item => {
                        item.classList.add('hide');
                        item.classList.remove('show', 'fade');
                  });
    
                  tabs.forEach(item => {
                        item.classList.remove('tabheader__item_active');
                  });
              }
    
              function showTabContent (i = 0) {
                tabContent[i].classList.add('show', 'fade');
                tabContent[i].classList.remove('hide');
                tabs[i].classList.add('tabheader__item_active');
              }
    
              hideTabContent();
              showTabContent();
    
              tabParrent.addEventListener('click', (event) => {
                    const target = event.target;
    
                    if(target && target.classList.contains('tabheader__item')){
                        tabs.forEach((item, i) => {
                            if(target == item){
                                hideTabContent();
                                showTabContent(i);
                            }
                        });
                    }
              });
    
     /////////////TIMER
    
              const deadLine = '2021-09-20';
    
              function getZero(num){
                if(num >= 0 && num <10){
                    return `0${num}`;
                } else {
                    return num;
                }
              }
    
              function getTimeRemaining(endTime){
                  const t = Date.parse(endTime) - Date.parse(new Date()),
                        days = Math.floor(t / (1000*60*60*24)),
                        hours =Math.floor((t / (1000*60*60))%24),
                        minutes = Math.floor((t / (1000*60))%60),
                        seconds = Math.floor((t / 1000)%60);
    
                return {
                    'total':t,
                    'days':days,
                    'hours':hours,
                    'minutes':minutes,
                    'seconds':seconds
                }   ;     
              }
    
              function setTime(sector, endTime){
                  const timer = document.querySelector(sector),
                        days = timer.querySelector('#days'),
                        hours = timer.querySelector('#hours'),
                        minutes = timer.querySelector('#minutes'),
                        seconds = timer.querySelector('#seconds'),
                        timeInterval = setInterval(updateClock, 1000);
    
                        updateClock();
    
                    function updateClock(){
                        const t = getTimeRemaining(endTime);
    
                        days.innerHTML = getZero(t.days);
                        hours.innerHTML = getZero(t.hours);
                        minutes.innerHTML = getZero(t.minutes);
                        seconds.innerHTML = getZero(t.seconds);
    
                        if(t.total <=0){
                            clearInterval(timeInterval);
                        }
                    }
              }
    
              setTime('.timer', deadLine);
    
    
    
    /////////////Modal
    
              const modalButtons = document.querySelectorAll('[data-modal]'),
                    modalCont = document.querySelector('.modal');
    
    
              modalButtons.forEach( event => {
                event.addEventListener('click', showModal);
              });
    
    
            
    
            modalCont.addEventListener('click', (e) => {
                if (e.target === modalCont || e.target.getAttribute('data-close') == ''){
                    closeModal();
                }
              });
    
              document.addEventListener('keydown', (e) =>{
                if (e.code === 'Escape' && modalCont.classList.contains('show')){
                    closeModal();
                }
              });
    
              function showModal (){
                modalCont.classList.add('show');
                modalCont.classList.remove('hide');
                document.body.style.overflow = 'hidden';
                clearInterval(showModalTimer);
              }
    
              function closeModal (){
                modalCont.classList.add('hide');
                modalCont.classList.remove('show');
                document.body.style.overflow = '';
              }
    
    
              const showModalTimer = setTimeout(showModal, 50000);
    
              let count = 0;
    
              window.addEventListener('scroll', () =>{
                if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight && count == 0){
                    showModal();
                    count ++;
                } 
              });
    
    
    ////////Classes
    
    
    // const   menuItem = document.querySelector('.menu__item'),
    //         imgPath = menuItem.querySelector('img'),
    //         name = menuItem.querySelector('.menu__item-subtitle'),
    //         text = menuItem.querySelector('.menu__item-subtitle'),
    //         price = menuItem.querySelector('.menu__item-total');
    
    
    class Menu {
        constructor(imgPath, alt, name, text, price, parentSelector, ...classes){
            this.imgPath = imgPath;
            this.alt = alt;
            this.name = name;
            this.text = text;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 27;
            this.changeToUAH();
        }
    
        changeToUAH() {
            this.price = this.price*this.transfer;
        }
    
        render(){
            const element = document.createElement('div');
    
            if(this.classes.length === 0){
                element.classList.add('menu__item');
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
    
            element.innerHTML = `
                <img src=${this.imgPath} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.name}</h3>
                <div class="menu__item-descr">${this.text}
                </div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    
    }
    
    const getResource = async (url) =>{
        const res = await fetch(url);
    
        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    };
    
    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) =>{
    //             new Menu(img, altimg, title, descr, price,  '.menu .container').render();
    //         });
    //     });
    
    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) =>{
                            new Menu(img, altimg, title, descr, price,  '.menu .container').render();
                        });
        });
    
    
    
    ///////Forms to server
    
    
    const forms = document.querySelectorAll('form');
    
    const messages = {
        loading: 'img/Forms/spinner.svg',
        success: 'Успешно! Мы с вами свяжемся!',
        failed: 'Что-то пошло не так'
    };
    
    forms.forEach(item =>{
        bindPostData(item);
    });
    
    
    const postData = async (url, data) =>{
        const res = await fetch(url, {
            method: 'POST',
            headers:{
                'Content-type': 'application/json'
            } ,
            body: data
        });
    
        return await res.json();
    };
    
    function bindPostData(form){
        form.addEventListener('submit', (e) =>{
            e.preventDefault();
    
            const statusMessage = document.createElement('img');
            statusMessage.src = messages.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
                height: 100px;
                width: 100px;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData = new FormData(form);
                 
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
    
    
            postData('http://localhost:3000/requests', json)   
            .then(data =>{
                console.log(data);
                showThanksModal(messages.success) ;
                statusMessage.remove();
            })
            .catch(() =>{
                showThanksModal(messages.failed) ;
            })
            .finally(() =>{
                form.reset();
            });
        });
    }
    
    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');
    
        prevModalDialog.classList.add('hide');
        showModal();
    
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class = "modal__content">
                <div class = "modal__close" data-close>&times;</div>
                <div class = "modal__title">${message}</div>
            </div>
        `;
        
        document.querySelector('.modal').append(thanksModal);
    
        setTimeout(() =>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    ////////////photo animation

    const offerSlide = document.querySelectorAll('.offer__slide');
    const nextButton = document.querySelector('.offer__slider-next');
    const prevButton = document.querySelector('.offer__slider-prev');
    const currentSlide = document.querySelector('#current'),
          slider = document.querySelector('.offer__slider'),
          totalSlides = document.querySelector('#total'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;
    let counter = 1,
        offset = 0;




    // slider(counter);


    function deleteNotDigit(str){
        return +str.replace(/\D/g, '');
    }

    // +width.slice(0, width.length - 2)

    // +width.replace(/\D/g, '')

    slidesField.style.width = 100 * offerSlide.length + '%';

    slidesField.style.display ='flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    if(offerSlide.length < 10){
        totalSlides.textContent = `0${offerSlide.length}`;
        currentSlide.textContent = `0${counter}`;
    } else {
        totalSlides.textContent = `${offerSlide.length}`;
        currentSlide.textContent = `0${counter}`;
    }

    

    offerSlide.forEach(slide =>{
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots =[];

    indicators.classList.add('carousel-indicators');

    slider.append(indicators);

    for(let i =0; i< offerSlide.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
       

        if(i==0){
            dot.style.opacity = 1;
        }

        indicators.append(dot);

        dots.push(dot);
    }

    nextButton.addEventListener('click', ()=>{
        if (offset == deleteNotDigit(width) * (offerSlide.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNotDigit(width);            
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(counter == offerSlide.length){
            counter =1;
        } else {
            counter ++;
        }

        if(offerSlide.length < 10){
            totalSlides.textContent = `0${offerSlide.length}`;
            currentSlide.textContent = `0${counter}`;
        } else {
            totalSlides.textContent = `${offerSlide.length}`;
            currentSlide.textContent = counter;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[counter -1].style.opacity = 1;
    });
    
    prevButton.addEventListener('click', ()=>{
        if (offset == 0) {
            offset = deleteNotDigit(width) * (offerSlide.length - 1);
        } else {
            offset -= deleteNotDigit(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(counter == 1 ){
            counter = offerSlide.length;
        } else {
            counter --;
        }

        if(offerSlide.length < 10){
            currentSlide.textContent = `0${counter}`;
        } else {
            currentSlide.textContent = counter;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[counter -1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) =>{
            const slideTo = e.target.getAttribute('data-slide-to');

            counter = slideTo;

            offset = deleteNotDigit(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            if(offerSlide.length < 10){
                currentSlide.textContent = `0${counter}`;
            } else {
                currentSlide.textContent = counter;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[counter -1].style.opacity = 1;


        });
    });

    

//  ===============calculator

const result = document.querySelector('.calculating__result span');



let sex, height, weight, age, ratio;

    if(localStorage.getItem('sex')){
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if(localStorage.getItem('ratio')){
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function calcRes(){
        if (!sex || !height || !weight || !age || !ratio){
            result.textContent = '____';
            return;
        } 
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    
    calcRes();

    function initLocalSettings(selector, activeClass){

        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                elem.classList.add(activeClass);
            }
            if(elem.getAttribute('id') === localStorage.getItem('sex')){
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function getStaticInformation (selector, activeClass){

        const element = document.querySelectorAll(selector);

        element.forEach(elem => {
            elem.addEventListener('click', (e) =>{

                

                if(e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                element.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);

                calcRes();

            });

        });
    }

    

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');


    


    function getDynamicInformation(selector){

        const input = document.querySelector(selector);

        input.addEventListener('input', () =>{

            if(input.value.match(/\D/g)){
                input.style.border = "2px solid red";
            } else {
                input.style.border = "none";
            }

            switch(input.getAttribute('id')){
                case 'height':
                    height = input.value;
                    break;
                case 'weight':
                    weight = input.value;
                    break;
                case 'age':
                    age = input.value;
                    break;
            }
            calcRes();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');


// const result = document.querySelector('.calculating__result span');
// let sex = 'female',
//     height, weight, age,
//     ratio = 1.375;

// function calcTotal() {
//     if (!sex || !height || !weight || !age || !ratio) {
//         result.textContent = '____'; // Можете придумать что угодно
//         return;
//     }
//     if (sex === 'female') {
//         result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
//     } else {
//         result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
//     }
// }

// calcTotal();

// function getStaticInformation(parentSelector, activeClass) {
//     const elements = document.querySelectorAll(`${parentSelector} div`);

//     elements.forEach(elem => {
//         elem.addEventListener('click', (e) => {
//             if (e.target.getAttribute('data-ratio')) {
//                 ratio = +e.target.getAttribute('data-ratio');
//             } else {
//                 sex = e.target.getAttribute('id');
//             }

//             elements.forEach(elem => {
//                 elem.classList.remove(activeClass);
//             });

//             e.target.classList.add(activeClass);

//             calcTotal();
//         });
//     });
// }

// getStaticInformation('#gender', 'calculating__choose-item_active');
// getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

// function getDynamicInformation(selector) {
//     const input = document.querySelector(selector);

//     input.addEventListener('input', () => {
//         switch(input.getAttribute('id')) {
//             case "height":
//                 height = +input.value;
//                 break;
//             case "weight":
//                 weight = +input.value;
//                 break;
//             case "age":
//                 age = +input.value;
//                 break;
//         }

//         calcTotal();
//     });
// }

// getDynamicInformation('#height');
// getDynamicInformation('#weight');
// getDynamicInformation('#age');


    });