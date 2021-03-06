import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import GoodsReceiptSession from './GoodsReceiptSession';

export enum EntryStatus {
    VALID = 'OK',
    WARNING = 'ATTENTION',
    ERROR = 'ERREUR',
}

@Entity()
export default class GoodsReceiptEntry {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column('text')
    public name?: string;

    @Column({
        type: 'int',
        nullable: true,
    })
    public packageQty?: number; // Colisage (nombre de produits par colis)

    @Column({
        type: 'int',
        nullable: true,
    })
    public productQtyPackage?: number; // Nombre de colis

    @Column('text')
    public productBarcode?: string;

    @Column('int')
    public productId?: number;

    @Column('text')
    public productName?: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    public productSupplierCode?: string;

    @Column('int')
    public expectedPackageQty?: number; // Colisage (nombre de produits par colis)

    @Column('int')
    public expectedProductQtyPackage?: number; // Nombre de colis

    @Column('int')
    public expectedProductQty?: number;

    @Column('int')
    public expectedProductUom?: number;

    @Column({
        type: 'int',
        nullable: true,
    })
    public productQty?: number; // Quantité totale

    @Column({
        type: 'int',
        nullable: true,
    })
    public productUom?: number; // Unité de mesure d'article

    @Column({
        type: 'text',
        nullable: true,
    })
    public comment?: string;

    @Column('boolean')
    public isExtra = false;

    @ManyToOne(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type => GoodsReceiptSession,
        goodsReceiptSession => goodsReceiptSession.goodsReceiptEntries,
        { onDelete: 'CASCADE' },
    )
    public goodsReceiptSession?: GoodsReceiptSession;

    public isValidPackageQty(): boolean | null {
        if (null === this.packageQty) {
            return null;
        }
        return this.expectedPackageQty === this.packageQty;
    }

    public isValidProductQtyPackage(): boolean | null {
        if (null === this.productQtyPackage) {
            return null;
        }
        return this.expectedProductQtyPackage === this.productQtyPackage;
    }

    public isValidQuantity(): boolean | null {
        if (null === this.productQty) {
            return null;
        }
        return this.expectedProductQty === this.productQty;
    }

    public isValidUom(): boolean | null {
        if (null === this.productUom) {
            return null;
        }
        return this.expectedProductUom === this.productUom;
    }

    public hasComment(): boolean {
        if (!this.comment) {
            return false;
        }
        return this.comment.length > 0;
    }

    public getStatus(): EntryStatus {
        if (true !== this.isValidQuantity()) {
            return EntryStatus.ERROR;
        }
        if (
            true !== this.isValidUom() ||
            this.hasComment() ||
            true !== this.isValidPackageQty() ||
            true !== this.isValidProductQtyPackage()
        ) {
            return EntryStatus.WARNING;
        }
        return EntryStatus.VALID;
    }
}
