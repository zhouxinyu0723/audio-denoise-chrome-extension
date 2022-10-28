export class CyclicBuffer{
    constructor(length, item_init_func){
        this.buffer_size = length;
        this.buffer = Array.from({length: this.buffer_size},item_init_func)
        this.buffer_pointer = 0;
    }
    write(new_item){
        this.buffer[this.buffer_pointer] = new_item;
        this.buffer_pointer ++;
        if (this.buffer_pointer == this.buffer_size){
            this.buffer_pointer = 0;
        }
    }
    read(){
        return this.buffer[this.buffer_pointer];
    }
}