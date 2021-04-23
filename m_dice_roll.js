const spellID = 1;
const rollTag = "roll";
const msg1 = "Uai madame, quer que eu advinhe o nome da magia também ?";
const msg2 = "Uai e o resto do comando ?";

var result = "";
var input = "roll d26 + 2 + d49";
var output = "";

if(input != "")
{
    output = getCommandByInput(input);  
    console.log(output);  
}


/*switch (spellID) 
{
    case 1 :  result = 'Acid Splash ' + AcidSplash(22);     break;
    case 2 :  result = 'Blade Ward ' + "\n" + BladeWard();  break;    
    case 3 :  result = 'Booming Blade';                     break;            
    case 4 :  result = 'Chill Touch';                       break;    
    case 5 :  result = 'Control Flame';                     break;    
    case 6 :  result = 'Create Bonfire';                    break;    
    case 7 :  result = 'Dancing Lights';                    break;
    case 8 :  result = 'Druidcraft';                        break;    
    case 9 :  result = 'Eldritch Blast';                    break;    
    case 10:  result = 'Encode Toughts';                    break;
    case 11:  result = 'Fire Bolt';                         break;    
    case 12:  result = 'Friends';                           break;    
}

console.log(result);*/

//Utils
function getIDByName(name)
{
    if(name === "")
    {
        return msg1;
    }
}

function getCommandByInput(input)
{ 
  var level; 
  var operator; 
  var result; 
  var dice;
  var diceExpr = "";   
  var diceResult = "";  
  let expression = [];
  var parts = input.split(" ");
  if(parts.length > 0)
  {
      if(parts[0] == rollTag)
      {
          if(parts.length == 1)
          {
              return msg2;
          }
          else
          {
            parts.forEach(element => {
              if(isCommand(element))
              {
                dice = diceCommand(element);
                
                if(anyEqualSymbol(dice))
                {
                    diceResult = getDiceResult(dice); 
                    if(isNumberOnly(diceResult))
                    {
                        expression.push(diceResult);
                        diceExpr = diceExpr + " " + dice; 
                    }                      
                }
                
                
              }
              else if(isLevel(element))
              {
                  level = getLevelbyExpression(element);
              }
              else if(isOperator(element))
              { 
                  operator = element;
                  expression.push(operator);
                  diceExpr = diceExpr + " " + operator; 
              } 
              else if(isNumberOnly(element))
              {
                expression.push(element);
                diceExpr = diceExpr + " " + element; 
              }
            });   
          }                                      
      }
  }
  result = executeExpression(expression);
  return diceExpr.trim() + " = " + result;
}

function executeExpression (exp)
{
    var sum = 0;
    var count = 1; 
    var op =  ""; 
    exp.forEach(element => {
        if(exp.length == 1 || count == 1)
        {
            sum = parseInt(element); 
        }
        if(!isOperator(element) && count > 1)
        {
            if(op != "")
            {
                sum = Calc(sum, element, op);
            }                
        } 
        else
        {
            if(isOperator(element))
            {
                op = element; 
            }
        }
        count++;                    
    });
    return sum; 

}

function Calc(a, b, op)
{
    switch(op)
    {
        case "+": return Sum(a,b); 
        case "-": return Sub(a,b);
        case "*": return Mult(a,b);
        case "/": return Div(a,b);        
    }
}

function Sum(op1, op2)
{
    return parseInt(op1) + parseInt(op2);
}

function Sub(op1, op2)
{
    return parseInt(op1) - parseInt(op2);
}

function Mult(op1, op2)
{
    return parseInt(op1) * parseInt(op2);
}

function Div(op1, op2)
{
    return Math.floor(parseInt(op1)/parseInt(op2));
}


function getDiceResult(dice)
{
    var results;
    results = dice.split("=");  
    
    if(results.length > 1)
    {
        return results[1].trim();
    }

    return dice.trim();  
}

function anyEqualSymbol(cmd)
{
    return cmd.match(/={1}/); 
}

function getOrdinal(lvl)
{
    var ordinal;
    var n = lvl % 100;
    if(n > 13)
    {
        n = n % 10;
    } 
    switch(n)
    {
        case 1: ordinal = "st"; break;
        case 2: ordinal = "nd"; break;
        case 3: ordinal = "rd"; break;
        default: ordinal = "th";
    } 
    return ordinal;
}

//Checks
function isOperator(op)
{
    switch(op)
    {
        case '+':
        case '-':
        case '*':
        case '/':        
            return true;            
    }
    return false; 
}

function isCommand(cmd)
{
    return cmd.match(/([0-9]*[d|D][0-9]+)/);
}

function isLevel(cmd)
{
    return cmd.match(/lvl[1-9]+/);
}

function isNdn(cmd)
{
    return cmd.match(/([1-9]*[d|D][1-9]+)/);
}

function isNumberOnly(i)
{
    if(i != "")
    {
        return (i.match(/[\d]+/) && !i.match(/[\D]/));
    }
    return false;        
}


function getLevelbyExpression(cmd)
{
    return cmd.replace("lvl","").trim();  
}

//Dice
function d6() 
{
    return Math.floor(Math.random() * 6) + 1;
}

function d8() 
{
    return Math.floor(Math.random() * 8) + 1;
}

function d20() 
{
    return Math.floor(Math.random() * 20) + 1;
}

function diceRoll(n)
{   
    return Math.floor(Math.random() * n) + 1;
}

function diceCommand(i)
{
    var results = "";
    var dice = 0;
    var sum = 0;
    if(isNdn(i))
    {
        i = i.replace("D", "d");
        var diceAmount = 1;
        var diceType = 0;
        var parts = i.split("d");
        if(parts.length > 1)
        {
            diceAmount = parts[0] != "" ? parts[0] : 1;
            diceType = parts[1];  
        }
        for(a = 0; a < diceAmount; a++ )
        {
            dice = diceRoll(diceType);
            sum = sum + dice;
            results = results + " " + dice;
        }
    }
    results = i + " [ " +  results.trim() + " ] = " + sum;
    return results;
}

//Spells Level 0

//Acid Splash
function AcidSplash(lvl)
{    
    if(lvl < 5)
    {           
        return lvl + getOrdinal(lvl) + " " + getCommandByInput("roll 1d6")  + " Acid Damage ";        
    } 
    else if(lvl >= 5 && lvl < 11)
    {
        return lvl + getOrdinal(lvl) + " " + getCommandByInput("roll 2d6") + " Acid Damage ";
    }
    else if(lvl >= 11 && lvl < 17)
    {
        return lvl + getOrdinal(lvl) + " "  + getCommandByInput("roll 3d6") + " Acid Damage ";
    } 
    else if(lvl >= 17)
    {
        return lvl + getOrdinal(lvl) + " "+ getCommandByInput("roll 4d6") + " Acid Damage ";
    }
}

//Blade Ward
function BladeWard()
{
    var description = " You extend you hand and trace a sigil of warding in the air. \n" +
                      " Until the end of your next turn, you have resistance against \n" +
                      " bludgeoning, piercing, and slashing damage dealt by weapon attacks.";
    return description;                  
}

//Booming Blade
function BoomingBlade(lvl, c, m)
{
    if((lvl < 5) && m )
    {
        return lvl + "th" + " Moviment 1d8 = " + d8() + " Thunder damage";
    } 
    else if (lvl >= 5 && lvl < 11)
    {
        let cantrip1 = [d8()];
        if(c)
        {
            return lvl + "th" + " 1d8 = " + cantrip1 + " Thunder damage";
        }
        if (m)
        {
            let moviment = [d8(), d8()];
            return lvl + "th" + " Moviment 2d8 [" + moviment[0] + ", " + moviment[1] + "]" + " = " + (moviment[0] + moviment[1]) + " Thunder damage";
        }
    }
    else if(lvl >= 11 && lvl < 17)
    {
        let cantrip2 = [d8(), d8()];
        if(c)
        {
            return lvl + "th" + " 2d8 [" + cantrip2[0] + ", " + cantrip2[1] + "]" + " = " + (cantrip2[0] + cantrip2[1]) + " Thunder damage";
        }
        if (m)
        {
            let moviment = [d8(), d8(), d8()];
            return lvl + "th" + " Moviment 3d8 [" + moviment[0] + ", " + moviment[1] + ", " + moviment[2] +  "]" + " = " + (moviment[0] + moviment[1] + moviment[2]) + " Thunder damage";
        }        
    }
    else if(lvl >= 17)
    {
        let cantrip3 = [d8(), d8(), d8()];
        if(c)
        {
            return lvl + "th" + " 3d8 [" + cantrip3[0] + ", " + cantrip3[1] + ", " + cantrip3[2] +  "]" + " = " + (cantrip2[0] + cantrip2[1] + cantrip2[2]) + " Thunder damage";
        }
        if (m)
        {
            let moviment = [d8(), d8(), d8(), d8()];
            return lvl + "th" + " Moviment 4d8 [" + moviment[0] + ", " + moviment[1] + ", " + moviment[2] + ", " + moviment[3] +  "]" + " = " + (moviment[0] + moviment[1] + moviment[2] + moviment[3]) + " Thunder damage";
        } 
    }
}