/**
 *                          Block class
 *  The Block class is a main component into any Blockchain platform, 
 *  it will store the data and act as a dataset for your application.
 *  The class will expose a method to validate the data... The body of
 *  the block will contain an Object that contain the data to be stored,
 *  the data should be stored encoded.
 *  All the exposed methods should return a Promise to allow all the methods 
 *  run asynchronous.
 */

const { json } = require('body-parser');
const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {

    // Constructor - argument data will be the object containing the transaction data
    //  Body data contiains the star object data 
    // Time is time stamp
	constructor(data){
        this.owner = null;
        this.message = null;
		this.hash = null;                                           // Hash of the block
		this.height = 0;                                            // Block Height (consecutive number of each block)
		this.body = Buffer(JSON.stringify(data)).toString('hex');   // Will contain the transactions stored in the block, by default it will encode the data
		this.time = parseInt(new Date().getTime().toString().slice(0, -3));                                              // Timestamp for the Block creation
		this.previousBlockHash = null;                              // Reference to the previous Block Hash
    }
    
    /**
     *  validate() method will validate if the block has been tampered or not.
     *  Been tampered means that someone from outside the application tried to change
     *  values in the block data as a consecuence the hash of the block should be different.
     *  Steps:
     *  1. Return a new promise to allow the method be called asynchronous.
     *  2. Save the in auxiliary variable the current hash of the block (`this` represent the block object)
     *  3. Recalculate the hash of the entire block (Use SHA256 from crypto-js library)
     *  4. Compare if the auxiliary hash value is different from the calculated one.
     *  5. Resolve true or false depending if it is valid or not.
     *  Note: to access the class values inside a Promise code you need to create an auxiliary value `let self = this;`
     */
    // Validating van een block?  Zien of een block in de blockchain valid is? Dat er niet mee getampered is. De hash
    // Mag niet veranderd worden
    // Resolve when the 
    validate() {
        //When the data changes  => then the  hash changes
        //Check the hash to find out 
        let self = this;
        return new Promise((resolve, reject) => {
            // Save in auxiliary variable the current block hash
            var currentHash = self.hash;
                                            
            // Recalculate the hash of the Block
            var changedHash = SHA256(JSON.stringify(self)).toString();

            // Comparing if the hashes changed
            if(currentHash != changedHash)
            {
                reject(false);
            }
            // Returning the Block is not valid
            // 
            else{

                resolve(true);
            }
            // Returning the Block is valid
            // Resolve when the block is valid ==> if this
        });
    }

    /**
     *  Auxiliary Method to return the block body (decoding the data)
     *  Steps:
     *  
     *  1. Use hex2ascii module to decode the data
     *  2. Because data is a javascript object use JSON.parse(string) to get the Javascript Object
     *  3. Resolve with the data and make sure that you don't need to return the data for the `genesis block` 
     *     or Reject with an error.
     */

    // Return the data from the block in json 
    // Block.data  => omzetten 
    getBData() {
        // Getting the encoded data saved in the Block
       
        // Decoding the data to retrieve the JSON representation of the object
        const blockData = hex2ascii(this.body);
        // Parse the data to an object to be retrieve.
        const block = JSON.parse(blockData);

        // Resolve with the data if the object isn't the Genesis block
        return new Promise((resolve, reject) => {
            if(block.previousBlockHash == null)
            {
                reject(new Error("Data is not in the genesis block")); 
            }
            else {
                resolve(blockData);
            }
        });
    }

}

module.exports.Block = Block;                    // Exposing the Block class as a module