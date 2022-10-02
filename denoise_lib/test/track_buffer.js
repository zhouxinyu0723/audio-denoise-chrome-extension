export class TrackBuffer 
{
    constructor(length){
        this.buffer_size = length;
        this.buffer = Array.from({length: this.buffer_size},()=>{return 0;})
        this.buffer_write_pointer = 0;
        this.buffer_read_pointer = length;
        this.buffer_write_p_min_read_p = 0;
    }
    push_item(item){
        this.buffer[this.buffer_write_pointer] = item;
        this.buffer_write_p_min_read_p ++;
        this.buffer_write_pointer ++;
        if (this.buffer_write_pointer == this.buffer_size){
            this.buffer_write_pointer = 0;
        }
    }
    increase_write_pointer(increase){
        this.buffer_write_p_min_read_p += increase;
        this.buffer_write_pointer += increase;
        if (this.buffer_write_pointer >= this.buffer_size){
            this.buffer_write_pointer -= this.buffer_size;
        }
    }
    push_array(array, increase=false){
        if (array.length > this.buffer_size - this.buffer_write_p_min_read_p){
            console.error("input array too large. input array length: ",array.length, " buffer lenght: ", this.buffer_size, " buffer remain space: ",this.buffer_size - this.buffer_write_p_min_read_p);
        }
        if (array.length <= this.buffer_size - this.buffer_write_pointer){
            array.forEach((e,i)=>{
                // console.log("zero",i)
                this.buffer[i + this.buffer_write_pointer] = array[i];
                // console.log(this.buffer)
        })
        }else{
            array.slice(0, this.buffer_size - this.buffer_write_pointer).forEach((e,i)=>{
                // console.log("first",i)
                this.buffer[i + this.buffer_write_pointer] = array[i]
                // console.log(this.buffer)
        })
            array.slice(this.buffer_size - this.buffer_write_pointer, array.size).forEach((e,i)=>{
                // console.log("second",i)
                this.buffer[i] = array[i + this.buffer_size -  this.buffer_write_pointer]
                // console.log(this.buffer)
            })
        }
        if (increase){
            this.buffer_write_p_min_read_p += array.length;
            console.log()
            this.buffer_write_pointer += array.length;
            if (this.buffer_write_pointer >= this.buffer_size){
                this.buffer_write_pointer -= this.buffer_size;
            }
        }
    }
    add_array(array, increase=false){
        if (array.length > this.buffer_size - this.buffer_write_p_min_read_p){
            console.error("input array too large. input array length: ",array.length, " buffer lenght: ", this.buffer_size, " buffer remain space: ",this.buffer_size - this.buffer_write_p_min_read_p);
        }
        if (array.length <= this.buffer_size - this.buffer_write_pointer){
            array.forEach((e,i)=>{
                // console.log("zero",i)
                this.buffer[i + this.buffer_write_pointer] = this.buffer[i + this.buffer_write_pointer] + array[i];
                // console.log(this.buffer)
        })
        }else{
            array.slice(0, this.buffer_size - this.buffer_write_pointer).forEach((e,i)=>{
                // console.log("first",i)
                this.buffer[i + this.buffer_write_pointer] = this.buffer[i + this.buffer_write_pointer] + array[i]
                // console.log(this.buffer)
        })
            array.slice(this.buffer_size - this.buffer_write_pointer, array.size).forEach((e,i)=>{
                // console.log("second",i)
                this.buffer[i] = this.buffer[i] + array[i + this.buffer_size -  this.buffer_write_pointer]
                // console.log(this.buffer)
            })
        }
        if (increase){
            this.buffer_write_p_min_read_p += array.length;
            this.buffer_write_pointer += array.length;
            if (this.buffer_write_pointer >= this.buffer_size){
                this.buffer_write_pointer -= this.buffer_size;
            }
        }
    }
    increase_read_pointer(increase){
        this.buffer_write_p_min_read_p -= increase;
        this.buffer_read_pointer += increase;
        if (this.buffer_read_pointer >= this.buffer_size){
            this.buffer_read_pointer -= this.buffer_size;
        }
    }
    read_item(update_pointer = false){
        item = this.buffer(this.buffer_read_pointer);
        if(update_pointer){
            this.buffer_write_p_min_read_p ++;
            this.buffer_read_pointer ++;
            if(this.buffer_read_pointer == this.buffer_size){
                this.buffer_read_pointer = 0;
            }
        }
        return item;
    }
    read_array(size,update_pointer = false){
        // if (size > this.buffer_size - this.buffer_write_p_min_read_p){
        //     console.error("No data to read. amount ask to read: ",size, " amound in the trace buffer: ", this.buffer_size - this.buffer_write_p_min_read_p);
        // }
        const result = Array.from({length:size},()=>0);
        // console.log(result)
        if (size <= this.buffer_read_pointer){
            result.forEach((_,i)=>{
                // console.log("first",i)
                result[i] = this.buffer[i + this.buffer_read_pointer - size];
                // console.log(result)
            });
        }else{
            result.slice(size - this.buffer_read_pointer, size).forEach((e,i)=>{
                // console.log("second",i)
                result[i + size - this.buffer_read_pointer] = this.buffer[i];
                // console.log(result)
            });
            result.slice(0, size - this.buffer_read_pointer).forEach((e,i)=>{
                // console.log("third",i)
                result[i] = this.buffer[i + this.buffer_size - size + this.buffer_read_pointer];
                // console.log(result)  
            });
        }
        if (update_pointer){
            this.buffer_write_p_min_read_p -= array.length;
            this.buffer_read_pointer += size;
            if (this.buffer_read_pointer >= this.buffer_size){
                this.buffer_read_pointer -= this.buffer_size;
            }
        }
        return result;
    }
}