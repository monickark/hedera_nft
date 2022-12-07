function main(){
    console.log("hai")

    let name="abdbgabaghab";
    console.log("Input:"+ name);
    let myArr = name.split("");
    let newArr = [];
    let curIndex;
    let startIndex;
    for(i=0; i<name.length; i++){
        if(newArr.includes(myArr[i])) {
            startIndex = i;
            continue
        }  
        newArr.push(myArr[i]); 
        curIndex = i;

    }
    console.log("cusrrentIndex: "+ curIndex);
    console.log("output Data: " + name.substring(startIndex,curIndex+1));
}
main()