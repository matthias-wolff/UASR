#!/usr/bin/perl

use Cwd;

die "Usage: $0 DIRLOG" if !@ARGV || !-d $ARGV[0];
chdir $ARGV[0];

my $exp=(split /\//,Cwd::realpath("."))[-2];
$exp=~s/_/\\\\_/g;

my %pl=();

open FD,"grep acc: dnn_iter_*_evl.log |";
while(<FD>){
	chomp $_;
	my @line=split /[_: ]/,$_;
	$line[2]=~s/\..*\.log//;
	$pl{"test acc2 (evl)"}->{$line[2]}=$line[-1]/100;
}
close FD;

my $it=0;
open FD,"<dnn_train.log";
while(<FD>){
	chomp $_;
	$it=$1 if $_=~/Iteration ([0-9]+),/;
	$pl{"test acc1 (trn)"}->{$it}=$1 if $_=~/Test net .* accuracy = ([0-9.]+)/;
	$pl{"test loss (trn)"}->{$it}=$1 if $_=~/Test net .* loss = ([0-9.e+-]+)/;
	$pl{"train loss (trn)"}->{$it}=$1 if $_=~/Train net .* loss = ([0-9.e+-]+)/;
}
close FD;

print "#-xy\n";
print "#-yrange 0:1\n";
print "#-xlabel Iteration\n";
print "#-ylabel Accuracy / Loss\n";
print "#-key left\n";
print "#-title $exp\n";

my $len=0;
foreach my $name (sort keys %pl){
	my @keys=keys %{$pl{$name}};
	$len=@keys if @keys>$len;
	print "#-cn $name\n";
	@keys=sort {$a<=>$b} @keys;
	$pl{$name}->{srt}=\@keys;
}

for(my $i=0;$i<$len;$i++){
	foreach my $name (sort keys %pl){
		my @keys=@{$pl{$name}->{srt}};
		if($i>=@keys){ print "\"\" \"\" "; }
		else{ print $keys[$i]." ".$pl{$name}->{$keys[$i]}." "; }
	}
	print "\n";
}
