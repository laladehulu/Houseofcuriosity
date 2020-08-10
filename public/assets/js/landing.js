function startStackedCard(){
    var stackedContainer = document.querySelector(".stacked-container");// the Section element
    //The div containing all cards, using a row to specify their width
    var cards =Array.from(document.querySelectorAll(".stacked-card-individual"));// get all individual cards which will play the animation
    console.log(stackedContainer);
    window.addEventListener('scroll', function(e) {
        scrollPos = window.scrollY;
      
        var stackedContainer = document.querySelector(".stacked-container");
        console.log(scrollPos,stackedContainer.offsetTop);
        if(scrollPos>200){//compare the scroll pos with the stacked card section's pos
  
            cards.forEach((element)=>{
                element.classList.add("visible");
            })
            console.log(cards);
        }
      });
}
startStackedCard();